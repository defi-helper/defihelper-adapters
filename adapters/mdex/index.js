const ethers = require("ethers");
const { coingecko, ethereum, toFloat, tokens } = require("../utils");
const masterChef = require("./masterChefABI.json");
const masterChefPools = require("./masterChiefPools.json");
const bn = require("bignumber.js");

const masterChiefAddress = "0xc48fe252aa631017df253578b1405ea399728a50";

module.exports = {
    masterChef: async (
        provider,
        contractAddress, //For instance: '0xcf7ca5e4968CF0d1dD26645e4cf3Cf4ED86b867F'
        initOptions = ethereum.defaultOptions()
    ) => {
        const options = {
            ...ethereum.defaultOptions(),
            ...initOptions,
        }
        const blockTag =
            options.blockNumber === "latest"
                ? "latest"
                : parseInt(options.blockNumber, 10);
        const network = (await provider.detectNetwork()).chainId;
        const block = await provider.getBlock(blockTag);
        const blockNumber = block.number;
        const avgBlockTime = await ethereum.getAvgBlockTime(provider, blockNumber);

        const masterChiefContract = new ethers.Contract(masterChiefAddress, masterChef, provider);

        const poolIndex = (masterChefPools.find(p => p.lpToken.toLowerCase() === contractAddress.toLowerCase())).index;
        const pool = await masterChiefContract.poolInfo(poolIndex);

        const rewardsTokenDecimals = 18;
        const stakingTokenDecimals = 18;
        const stakingToken = contractAddress.toLowerCase();
        const rewardsToken = (await masterChiefContract.mdx()).toLowerCase();

        const [mdxPerBlock, totalAllocPoint] = await Promise.all([
            await masterChiefContract.mdxPerBlock(),
            await masterChiefContract.totalAllocPoint(),
        ]);

        const rewardPerBlock = toFloat((new bn(pool.allocPoint.toString())).multipliedBy(mdxPerBlock.toString()).dividedBy(totalAllocPoint.toString()), rewardsTokenDecimals);

        const rewardTokenUSD = await coingecko.getPriceUSDByContract(
            coingecko.platformByEthereumNetwork(network),
            blockTag === "latest",
            block,
            rewardsToken
        );

        const totalLocked = toFloat(await ethereum.erc20(provider, contractAddress).balanceOf(masterChiefAddress), stakingTokenDecimals);
        const {
            token0,
            reserve0,
            token1,
            reserve1,
            totalSupply: lpTotalSupply,
        } = await ethereum.uniswap.pairInfo(provider, stakingToken);
        const token0Usd = await coingecko.getPriceUSDByContract(
            coingecko.platformByEthereumNetwork(network),
            blockTag === "latest",
            block,
            token0
        );
        const token1Usd = await coingecko.getPriceUSDByContract(
            coingecko.platformByEthereumNetwork(network),
            blockTag === "latest",
            block,
            token1
        );
        let stakingTokenUSD = new bn(reserve0)
            .multipliedBy(token0Usd)
            .plus(new bn(reserve1).multipliedBy(token1Usd))
            .div(lpTotalSupply);
        if (!stakingTokenUSD.isFinite()) stakingTokenUSD = new bn(0);

        const tvl = new bn(totalLocked).multipliedBy(stakingTokenUSD);
        let aprBlock = rewardPerBlock.multipliedBy(rewardTokenUSD).div(tvl);
        if (!aprBlock.isFinite()) aprBlock = new bn(0);
        const blocksPerDay = new bn(1000 * 60 * 60 * 24 / avgBlockTime);
        const aprDay = aprBlock.multipliedBy(blocksPerDay);
        const aprWeek = aprBlock.multipliedBy(blocksPerDay.multipliedBy(7));
        const aprMonth = aprBlock.multipliedBy(blocksPerDay.multipliedBy(30));
        const aprYear = aprBlock.multipliedBy(blocksPerDay.multipliedBy(365));

        return {
            staking: {
                token: stakingToken,
                decimals: stakingTokenDecimals,
            },
            reward: {
                token: rewardsToken,
                decimals: rewardsTokenDecimals,
            },
            metrics: {
                tvl: tvl.toString(10),
                aprDay: aprDay.toString(10),
                aprWeek: aprWeek.toString(10),
                aprMonth: aprMonth.toString(10),
                aprYear: aprYear.toString(10),
                rewardPerDay: rewardPerBlock.multipliedBy(blocksPerDay).toString(),
            },
            wallet: async (walletAddress) => {
                let { amount, rewardDebt } = await masterChiefContract.userInfo(poolIndex, walletAddress);
                const balance = toFloat(amount, ethereum.uniswap.pairDecimals);
                const earned = toFloat(rewardDebt, rewardsTokenDecimals);
                let token0Balance = balance.multipliedBy(reserve0).div(lpTotalSupply);
                if (!token0Balance.isFinite()) token0Balance = new bn(0);
                const token0BalanceUSD = token0Balance.multipliedBy(token0Usd);
                let token1Balance = balance.multipliedBy(reserve1).div(lpTotalSupply);
                if (!token1Balance.isFinite()) token1Balance = new bn(0);
                const token1BalanceUSD = token1Balance.multipliedBy(token1Usd);
                const earnedUSD = earned.multipliedBy(rewardTokenUSD);

                return {
                    staked: {
                        [token0]: {
                            balance: token0Balance.toString(10),
                            usd: token0BalanceUSD.toString(10),
                        },
                        [token1]: {
                            balance: token1Balance.toString(10),
                            usd: token1BalanceUSD.toString(10),
                        },
                    },
                    earned: {
                        [rewardsToken]: {
                            balance: earned.toString(10),
                            usd: earnedUSD.toString(10),
                        },
                    },
                    metrics: {
                        staking: balance.toString(10),
                        stakingUSD: balance.multipliedBy(stakingTokenUSD).toString(10),
                        earned: earned.toString(10),
                        earnedUSD: earnedUSD.toString(10),
                    },
                    tokens: tokens(
                        {
                            token: token0,
                            data: {
                                balance: token0Balance.toString(10),
                                usd: token0BalanceUSD.toString(10),
                            },
                        },
                        {
                            token: token1,
                            data: {
                                balance: token1Balance.toString(10),
                                usd: token1BalanceUSD.toString(10),
                            },
                        },
                        {
                            token: rewardsToken,
                            data: {
                                balance: earned.toString(10),
                                usd: earnedUSD.toString(10),
                            },
                        }
                    ),
                };
            },

            actions: async (walletAddress) => {
                if (options.signer === null) {
                    throw new Error(
                        "Signer not found, use options.signer for use actions"
                    );
                }
                const { signer } = options;
                const stakingTokenContract = ethereum
                    .erc20(provider, stakingToken)
                    .connect(signer);
                const stakingContract = masterChiefContract.connect(signer);

                return {
                    stake: {
                        can: async (amount) => {
                            const balance = await stakingTokenContract.balanceOf(
                                walletAddress
                            );
                            if ((new bn(amount)).isGreaterThan(balance.toString())) {
                                return Error("Amount exceeds balance");
                            }

                            return true;
                        },
                        send: async (amount) => {
                            await stakingTokenContract.approve(masterChiefAddress, amount);
                            await stakingContract.deposit(poolIndex, amount);
                        },
                    },
                    unstake: {
                        can: async (amount) => {
                            const userInfo = await stakingContract.userInfo(poolIndex, walletAddress);
                            if ((new bn(amount)).isGreaterThan(userInfo.amount.toString())) {
                                return Error("Amount exceeds balance");
                            }

                            return true;
                        },
                        send: async (amount) => {
                            await stakingContract.withdraw(poolIndex, amount);
                        },
                    },
                    claim: {
                        can: async () => {
                            const earned = await masterChiefContract.pending(poolIndex, walletAddress);
                            if ((new bn(earned.toString())).isLessThanOrEqualTo(0)) {
                                return Error("No earnings");
                            }
                            return true;
                        },
                        send: async () => {
                            await stakingContract.deposit(poolIndex, 0);
                        },
                    },
                    exit: {
                        can: async () => {
                            const userInfo = await stakingContract.userInfo(poolIndex, walletAddress);
                            if ((new bn(userInfo.amount.toString())).isLessThanOrEqualTo(0)) {
                                return Error("No LP in contract");
                            }

                            return true;
                        },
                        send: async () => {
                            const userInfo = await stakingContract.userInfo(poolIndex, walletAddress);
                            await stakingContract.withdraw(poolIndex, userInfo.amount.toString());
                        },
                    },
                };
            },
        };
    }
};

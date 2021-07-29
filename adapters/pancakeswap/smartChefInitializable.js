const ethers = require("ethers");
const { coingecko, ethereum, toFloat, tokens } = require("../utils");
const smartChefInitializable = require("./smartChefInitializableABI.json");
const bn = require("bignumber.js");


module.exports = {
    smartChefInitializable: async (
        provider,
        contractAddress, //For instance: '0x5e49531BA07bE577323e55666D46C6217164119E'
        initOptions = ethereum.defaultOptions()
    ) => {
        console.log(1);
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

        const contract = new ethers.Contract(contractAddress, smartChefInitializable, provider);
        const [rewardTokenAddress, stakedTokenAddress] = await Promise.all([
            contract.rewardToken().then(res => res.toLowerCase()),
            contract.stakedToken().then(res => res.toLowerCase()),
        ]);

        const [rewardToken, stakedToken] = await Promise.all([
            ethereum.erc20Info(provider, rewardTokenAddress),
            ethereum.erc20Info(provider, stakedTokenAddress),
        ])

        const rewardTokenDecimals = rewardToken.decimals;
        const stakedTokenDecimals = stakedToken.decimals;

        const rewardPerBlock = toFloat(await contract.rewardPerBlock(), rewardTokenDecimals);

        const totalLocked = toFloat(await ethereum.erc20(provider, stakedTokenAddress).balanceOf(contractAddress), stakedTokenDecimals);

        let tokenUSD = new bn(await coingecko.getPriceUSDByContract(
            coingecko.platformByEthereumNetwork(network),
            blockTag === "latest",
            block,
            stakedTokenAddress
        ));

        if (!tokenUSD.isFinite()) tokenUSD = new bn(0);

        const tvl = new bn(totalLocked).multipliedBy(tokenUSD);

        let aprBlock = rewardPerBlock.multipliedBy(tokenUSD).div(tvl);
        if (!aprBlock.isFinite()) aprBlock = new bn(0);

        const blocksPerDay = new bn(1000 * 60 * 60 * 24 / avgBlockTime);
        const aprDay = aprBlock.multipliedBy(blocksPerDay);
        const aprWeek = aprBlock.multipliedBy(blocksPerDay.multipliedBy(7));
        const aprMonth = aprBlock.multipliedBy(blocksPerDay.multipliedBy(30));
        const aprYear = aprBlock.multipliedBy(blocksPerDay.multipliedBy(365));

        return {
            staking: {
                token: stakedTokenAddress,
                decimals: stakedTokenDecimals,
            },
            reward: {
                token: rewardTokenAddress,
                decimals: rewardTokenDecimals,
            },
            metrics: {
                tvl: tvl.toString(10),
                aprDay: aprDay.toString(10),
                aprWeek: aprWeek.toString(10),
                aprMonth: aprMonth.toString(10),
                aprYear: aprYear.toString(10),
                tokenPerBlock: rewardPerBlock.toString(),
                rewardPerDay: rewardPerBlock.multipliedBy(blocksPerDay).toString(),
            },
            wallet: async (walletAddress) => {
                let { amount, rewardDebt } = await contract.userInfo(walletAddress);
                const balance = toFloat(amount, stakedTokenDecimals);
                const earned = toFloat(rewardDebt, rewardTokenDecimals);
                const balanceUsd = balance.multipliedBy(tokenUSD);
                const earnedUSD = earned.multipliedBy(tokenUSD);

                return {
                    staked: {
                        [stakedTokenAddress]: {
                            balance: balance.toString(10),
                            usd: balanceUsd.toString(10),
                        },
                    },
                    earned: {
                        [rewardTokenAddress]: {
                            balance: earned.toString(10),
                            usd: earnedUSD.toString(10),
                        },
                    },
                    metrics: {
                        staking: balance.toString(10),
                        stakingUSD: balanceUsd.toString(10),
                        earned: earned.toString(10),
                        earnedUSD: earnedUSD.toString(10),
                    },
                    tokens: tokens(
                        {
                            token: stakedTokenAddress,
                            data: {
                                balance: balance.toString(10),
                                usd: balanceUsd.toString(10),
                            },
                        },
                        {
                            token: rewardTokenAddress,
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
                    .erc20(provider, stakedTokenAddress)
                    .connect(signer);
                const stakingContract = contract.connect(signer);

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
                            await stakingTokenContract.approve(contractAddress, amount);
                            await stakingContract.deposit(amount);
                        },
                    },
                    unstake: {
                        can: async (amount) => {
                            const userInfo = await stakingContract.userInfo(walletAddress);
                            if ((new bn(amount)).isGreaterThan(userInfo.amount.toString())) {
                                return Error("Amount exceeds balance");
                            }

                            return true;
                        },
                        send: async (amount) => {
                            await stakingContract.withdraw(amount);
                        },
                    },
                    claim: {
                        can: async () => {
                            const earned = await contract.pendingReward(walletAddress);
                            if ((new bn(earned.toString())).isLessThanOrEqualTo(0)) {
                                return Error("No earnings");
                            }
                            return true;
                        },
                        send: async () => {
                            await stakingContract.withdraw(0);
                        },
                    },
                    exit: {
                        can: async () => {
                            const userInfo = await stakingContract.userInfo(walletAddress);
                            if ((new bn(userInfo.amount.toString())).isLessThanOrEqualTo(0)) {
                                return Error("No LP in contract");
                            }

                            return true;
                        },
                        send: async () => {
                            const userInfo = await stakingContract.userInfo(walletAddress);
                            await stakingContract.withdraw(userInfo.amount.toString());
                        },
                    },
                };
            },
        };
    }
};

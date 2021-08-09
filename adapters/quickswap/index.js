const { axios, bn, dayjs } = require('../lib');
const { staking } = require('../utils');

const getTimestampsBlocks = async (timestamps) => {
  const res = (await axios.post('https://api.thegraph.com/subgraphs/name/sameepsi/maticblocks', {
    query: `
      query blocks {
        ${timestamps.map(timestamp => `
         t${timestamp}:blocks(
            first: 1
            orderBy: timestamp
            orderDirection: asc
            where: { timestamp_gt: ${timestamp}, timestamp_lt: ${timestamp + 600} }
         ) {
           number
         }
        `)}
      }
    `,
    variables: {},
  }));
  return Object.values(res.data.data).map(blocks => Number(blocks[0].number));
}


const getPairVolume = async (id, block) => {
  const res = (await axios.post('https://api.thegraph.com/subgraphs/name/sameepsi/quickswap06', {
    query: `
     {
      pair(${block ? `block: {number: ${block}}` : ``} id: "${id}")
          {
            id
            volumeUSD
            __typename
           }
      }
    `,
    variables: {},
  }));

  return Number(res.data.data.pair.volumeUSD);
};

const getApyPerDay = async (provider, stakingToken, contractAddress, rewardRate, rewardTokenUSD, tvl) => {
  const ago24h = dayjs.unix(Math.round(Date.now() / 1000)).subtract(1, 'day').startOf('minute').unix()
  const [block24hAgo] = await getTimestampsBlocks([ago24h]);
  const [currentVolume, volume24hAgo] = await Promise.all([
    getPairVolume(stakingToken),
    getPairVolume(stakingToken, block24hAgo),
  ]);

  const volume24h = currentVolume - volume24hAgo;
  const fee24h = volume24h * 0.003;

  const rewardUSDPerDay = new bn(rewardRate).multipliedBy(60 * 60 * 24).multipliedBy(rewardTokenUSD);

  return (rewardUSDPerDay.plus(fee24h)).div(tvl);
}

module.exports = {
  // For instance: 0x4A73218eF2e820987c59F838906A82455F42D98b
  polygonStakingRewards: staking.synthetixStaking(getApyPerDay),
};

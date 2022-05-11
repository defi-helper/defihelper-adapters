require('dotenv').config();
const hardhat = require('hardhat');
const path = require('path');
const Express = require('express');
const { json } = require('body-parser');
const glob = require('tiny-glob');
const { v4: uuid } = require('uuid');
const fs = require('fs');
const knex = require('knex');

function isFileExists(path) {
  return fs.promises
    .access(path)
    .then(() => true)
    .catch(() => false);
}

const databaseSsl = process.env.DATABASE_SSL ?? '';
const database = knex({
  client: 'pg',
  connection: {
    host: process.env.DATABASE_HOST ?? 'localhost',
    port: Number(process.env.DATABASE_PORT ?? '5432'),
    user: process.env.DATABASE_USER ?? '',
    password: process.env.DATABASE_PASSWORD ?? '',
    database: process.env.DATABASE_NAME ?? '',
    ssl: databaseSsl
      ? {
          ca: fs.readFileSync(databaseSsl),
        }
      : undefined,
  },
});

const app = Express();
app.use(Express.static(path.resolve(__dirname, '../adapters-public-ts')));
app.use(Express.static(path.resolve(__dirname, '../adapters-public')));
app.get('/cache', async (req, res) => {
  const { protocol, key } = req.query;

  return res.json(
    await database('cache')
      .where({ protocol, key })
      .first()
      .then((row) => (row ? row.data : []))
  );
});
app.post('/cache', [json()], async (req, res) => {
  const auth = req.header('Auth');
  if (auth !== process.env.CACHE_AUTH) return res.status(403).send('');

  const { protocol, key } = req.query;
  const data = req.body;

  const cache = {
    protocol,
    key,
    data: JSON.stringify(data, null, 4),
  };
  const updated = await database('cache').update(cache).where({ protocol, key });
  if (updated === 0) {
    await database('cache').insert({ ...cache, id: uuid() });
  }

  return res.status(200).send('');
});
app.get(/^\/automates\/ethereum\/([a-z0-9_-]+)\/([a-z0-9_]+)\/([0-9]+)$/i, async (req, res) => {
  const { 0: protocol, 1: contract, 2: network } = req.params;
  const isNew = await isFileExists(path.resolve(__dirname, `../automates/${protocol}/artifacts`));
  if (isNew) {
    const contractBuildArtifactPath = path.resolve(
      __dirname,
      `../automates/${protocol}/artifacts/build/contracts/${contract}.automate.sol/${contract}.json`
    );
    const isBuildArtifactExists = await isFileExists(contractBuildArtifactPath);
    if (!isBuildArtifactExists) {
      console.log(contractBuildArtifactPath, e.toString());
      return res.status(404).send('Automate not found');
    }

    const buildArtifact = await fs.promises.readFile(contractBuildArtifactPath);
    const { contractName, abi, bytecode, linkReferences } = JSON.parse(buildArtifact.toString('utf-8'));
    const [networkName] = Object.entries(hardhat.config.networks).find(
      ([, { chainId }]) => parseInt(network, 10) === chainId
    ) ?? [''];

    const contractDeployArtifactPath = path.resolve(
      __dirname,
      `../automates/${protocol}/artifacts/deploy/${networkName}/${protocol}${contract}.json`
    );
    const isDeployArtifactExists = await isFileExists(contractDeployArtifactPath);

    return res.json({
      contractName,
      address: isDeployArtifactExists
        ? await fs.promises
            .readFile(contractDeployArtifactPath)
            .then((artifact) => JSON.parse(artifact.toString('utf-8')).address)
        : undefined,
      abi,
      bytecode,
      linkReferences,
    });
  } else {
    const contractBuildArtifactPath = path.resolve(
      __dirname,
      `../automates-public/ethereum/build/automates/${protocol}/${contract}.automate.sol/${contract}.json`
    );
    try {
      await fs.promises.access(contractBuildArtifactPath, fs.F_OK);
      const buildArtifact = await fs.promises.readFile(contractBuildArtifactPath);
      const { contractName, abi, bytecode, linkReferences } = JSON.parse(buildArtifact.toString('utf-8'));

      const [networkName] = Object.entries(hardhat.config.networks).find(
        ([, { chainId }]) => parseInt(network, 10) === chainId
      ) ?? [''];

      const contractDeployArtifactPath = path.resolve(
        __dirname,
        `../automates-public/ethereum/deployment/${networkName}/${protocol}${contract}.json`
      );
      let deployAddress = undefined;
      try {
        await fs.promises.access(contractDeployArtifactPath, fs.F_OK);
        const deployArtifact = await fs.promises.readFile(contractDeployArtifactPath);
        deployAddress = JSON.parse(deployArtifact.toString('utf-8')).address;
      } catch (e) {
        if (e.message.indexOf('ENOENT: no such file or directory') === -1) console.error(e);
      }

      return res.json({
        contractName,
        address: deployAddress,
        abi,
        bytecode,
        linkReferences,
      });
    } catch (e) {
      console.log(contractBuildArtifactPath, e.toString());
      return res.status(404).send('Automate not found');
    }
  }
});
app.get('/automates/ethereum', async (req, res) => {
  return res.json([
    ...(await glob(path.resolve(__dirname, '../automates-public/ethereum/build/automates/**/*.automate.sol')).then(
      (artifacts) =>
        artifacts.map((automate) => {
          const { name, dir } = path.parse(automate);
          const protocol = path.parse(dir).name;
          const contract = path.parse(name).name;
          return { protocol, contract };
        })
    )),
    ...(await glob(path.resolve(__dirname, '../automates/*/artifacts')).then((projects) =>
      projects.reduce(async (prev, projectPath) => {
        const result = await prev;
        const protocol = path.parse(path.parse(projectPath).dir).name;

        const artifacts = await glob(path.resolve(projectPath, './build/contracts/**/*.automate.sol'));
        if (artifacts.length === 0) return result;

        return [
          ...result,
          ...artifacts.map((artifact) => ({ protocol, contract: path.parse(path.parse(artifact).name).name })),
        ];
      }, Promise.resolve([]))
    )),
  ]);
});
app.get(/^\/automates\/waves\/([a-z0-9_-]+)\/([a-z0-9_]+)$/i, async (req, res) => {
  const { 0: protocol, 1: contract } = req.params;
  const contractBuildArtifactPath = path.resolve(
    __dirname,
    `../automates-public/waves/build/automates/${protocol}/${contract}.automate.ride/${contract}.automate.json`
  );
  try {
    await fs.promises.access(contractBuildArtifactPath, fs.F_OK);
    const buildArtifact = await fs.promises.readFile(contractBuildArtifactPath);
    const { base64, size, complexity } = JSON.parse(buildArtifact.toString('utf-8'));

    return res.json({
      contractName: contract,
      base64,
      size,
      complexity,
    });
  } catch (e) {
    console.log(contractBuildArtifactPath, e.toString());
    return res.status(404).send('Automate not found');
  }
});
app.get('/automates/waves', async (req, res) => {
  const automates = await glob(path.resolve(__dirname, '../automates-public/waves/build/automates/**/*.automate.ride'));
  return res.json(
    automates.map((automate) => {
      const { name, dir } = path.parse(automate);
      return { protocol: path.parse(dir).name, contract: path.parse(name).name };
    })
  );
});
app.get('/token-bridges', async (req, res) => {
  const platformMap = {
    1: 'ethereum',
    56: 'binance-smart-chain',
    128: 'huobi-token',
    137: 'polygon-pos',
    250: 'fantom',
    1285: 'moonriver',
    1284: 'moonbeam',
    43114: 'avalanche',
  };
  const bridgesFiles = await glob(path.resolve(__dirname, '../adapters-ts/**/data/bridgeTokens.json'));

  return res.json(
    await bridgesFiles.reduce(async (result, file) => {
      const bridges = JSON.parse(await fs.promises.readFile(file));
      const network = bridges.meta.network;

      return [
        ...(await result),
        ...Object.entries(bridges).reduce((result, [address, alias]) => {
          if (typeof alias.id === 'string') {
            return [...result, { network, address, priceFeed: { type: 'coingeckoId', id: alias.id } }];
          }
          if (typeof alias.platrofm === 'string' && typeof alias.address === 'string') {
            return [
              ...result,
              {
                network,
                address,
                priceFeed: { type: 'coingeckoAddress', platform: alias.platform, address: alias.address },
              },
            ];
          }
          if (
            typeof alias.network === 'number' &&
            typeof alias.address === 'string' &&
            platformMap[alias.network] !== undefined
          ) {
            return [
              ...result,
              {
                network,
                address,
                priceFeed: { type: 'coingeckoAddress', platform: platformMap[alias.network], address: alias.address },
              },
            ];
          }
          return result;
        }, []),
      ];
    }, [])
  );
});
app.get('/', async (req, res) => {
  const adapters = await glob(path.resolve(__dirname, '../adapters-public/*.js')).then((adapters) =>
    adapters.map((adapter) => path.parse(adapter).name)
  );
  const adaptersTS = await glob(path.resolve(__dirname, '../adapters-public-ts/*.js')).then((adapters) =>
    adapters.map((adapter) => path.parse(adapter).name)
  );

  return res.json([...adapters, ...adaptersTS]);
});
app.use(Express.static(path.resolve(__dirname, '../public')));
app.get(/^\/client/, (req, res) => {
  return res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

const port = 8080;
app.listen(port, () => console.log(`Listen ${port}`));

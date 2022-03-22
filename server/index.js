require('dotenv').config();
const hardhat = require('hardhat');
const path = require('path');
const Express = require('express');
const { json } = require('body-parser');
const glob = require('tiny-glob');
const fs = require('fs');

const app = Express();
app.use(Express.static(path.resolve(__dirname, '../adapters-public')));
app.use(Express.static(path.resolve(__dirname, '../adapters-public-ts')));
app.use('/cache', [json()], Express.static(path.resolve(__dirname, './cache')));
app.post(/^\/cache\/(.+)/i, async (req, res) => {
  const auth = req.header('Auth');
  if (auth !== process.env.CACHE_AUTH) return res.status(403).send('');

  const { 0: key } = req.params;
  const data = req.body;

  await fs.promises.writeFile(path.resolve(__dirname, `./cache/${key}`), JSON.stringify(data, null, 4), { flag: 'w' });

  return res.status(200).send('');
});
app.get(/^\/automates\/ethereum\/([a-z0-9_-]+)\/([a-z0-9_]+)\/([0-9]+)$/i, async (req, res) => {
  const { 0: protocol, 1: contract, 2: network } = req.params;
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
});
app.get('/automates/ethereum', async (req, res) => {
  const automates = await glob(
    path.resolve(__dirname, '../automates-public/ethereum/build/automates/**/*.automate.sol')
  );
  return res.json(
    automates.map((automate) => {
      const { name, dir } = path.parse(automate);
      return { protocol: path.parse(dir).name, contract: path.parse(name).name };
    })
  );
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

const port = 9001;
app.listen(port, () => console.log(`Listen ${port}`));

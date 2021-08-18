const path = require('path');
const Express = require('express');
const glob = require('tiny-glob');
const fs = require('fs');

const app = Express();
app.use(Express.static(path.resolve(__dirname, '../adapters-public')));
app.get(/^\/automates\/ethereum\/([a-z0-9_\/-]+)\/([a-z0-9_]+)$/i, async (req, res) => {
  const { 0: dir, 1: contract } = req.params;
  const contractPath = path.resolve(
    __dirname,
    `../automates-public/ethereum/automates/${dir}/${contract}.sol/${contract}.json`
  );
  try {
    await fs.promises.access(contractPath, fs.F_OK);
    return res.sendFile(contractPath);
  } catch (e) {
    console.log(contractPath, e.toString());
    return res.status(404).send('Automate not found');
  }
});
app.get('/', async (req, res) => {
  const adapters = await glob(path.resolve(__dirname, '../adapters-public/*.js'));
  return res.json(adapters.map((adapter) => path.parse(adapter).name));
});
app.use(Express.static(path.resolve(__dirname, '../public')));
app.get(/^\/client/, (req, res) => {
  return res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

const port = 9001;
app.listen(port, () => console.log(`Listen ${port}`));

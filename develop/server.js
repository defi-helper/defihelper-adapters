const { resolve } = require('path');
const Express = require('express');
const fs = require('fs');

const app = Express();
app.use(Express.static(resolve(__dirname, '../adapters-public')));
app.get(/^\/automates\/ethereum\/([a-z0-9_\/-]+)\/([a-z0-9_]+)$/i, async (req, res) => {
  const { 0: dir, 1: contract } = req.params;
  const path = resolve(__dirname, `../automates-public/ethereum/automates/${dir}/${contract}.sol/${contract}.json`);
  try {
    await fs.promises.access(path, fs.F_OK);
    return res.sendFile(path);
  } catch (e) {
    console.log(path);
    return res.status(404).send('Automate not found');
  }
});

const port = 9001;
app.listen(port, () => console.log(`Listen ${port}`));

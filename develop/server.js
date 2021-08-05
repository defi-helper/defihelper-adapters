const path = require('path');
const Express = require('express');
const glob = require('tiny-glob');

const app = Express();
app.use(Express.static(path.resolve(__dirname, '../adapters-public')));
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

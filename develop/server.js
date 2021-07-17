const { resolve } = require("path");
const Express = require("express");

const app = Express();
app.use(Express.static(resolve(__dirname, "../adapters-public")));

const port = 9001;
app.listen(port, () => console.log(`Listen ${port}`));

const server = require('./src/server');
const bot = require('./src/bot');
require('dotenv').config();

(async function () {
  await server.start();
  await bot.start();
})();

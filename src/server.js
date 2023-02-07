const express = require('express');

module.exports = {
  start: async function () {
    const port = process.env.PORT || 3000;
    const app = express();

    app.use(express.static('public'));
    app.listen(port, console.log(`[pid ${process.pid}] Listening at port ${port}`));
  }
};

const express = require('express');

module.exports = function () {
  const app = express();
  app.get('/', (req, res) => res.send('Bot is running.'));
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🌐 Express 保活中，PORT: ${PORT}`);
  });
};

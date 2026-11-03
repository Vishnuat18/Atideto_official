const appHandler = require('../server/server.cjs');

module.exports = async (req, res) => {
  return appHandler(req, res);
};

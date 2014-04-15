var cite = require("./cite");

module.exports = function(app) {
  app.get("/cite", cite);
};

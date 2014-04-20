var citation = require("./citation");

module.exports = function(app) {
  app.get("/cite", citation.cite);
  app.get("/cached", citation.cached);
};

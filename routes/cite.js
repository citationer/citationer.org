var Citation = require("citation.js");

module.exports = function(req, res) {
  var query = req.query.q;
  var host;

  if (!(/\w+/.test(query))) {
    res.send(400, "Bad query");
  }

  if (!(/^https?/.test(query))) {
    host = "http://" + query;
  }
  else {
    host = query;
  }

  var citation = new Citation(host);

  citation.getMlaReference(function(err, ref) {
    if (err) {
      return res.send(500, err) && console.log(err);
    }
    if (!ref) {
      return res.send(500, "Bad reference");
    }
    res.send(ref);
  });
};

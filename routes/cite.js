var Citation = require("citation.js");

module.exports = function(req, res) {
  var query = req.query.q;
  var url;

  if (!(/\w+/.test(query))) {
    res.send(400, "Bad query");
  }

  if (!(/^https?/.test(query))) {
    url = "http://" + query;
  }
  else {
    url = query;
  }

  var citation = new Citation(url);

  citation.getMlaReference(function(err, ref) {
    if (err) {
      return res.send(500, err) && console.log(err);
    }
    res.send(ref);
  });
};

var config = require("../config.json");
var redis = require("redis");
var Citation = require("citation.js");

var client = redis.createClient();

client.on("error", function(err) {
  console.error(err);
});

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

  client.get(host, function(err, ref) {
    if (ref) {
      return res.send(ref);
    }

    citation.getMlaReference(function(err, ref) {
      if (err) {
        return res.send(500, err) && console.log(err);
      }

      if (!ref) {
        return res.send(500, "Bad reference");
      }

      client.set(host, ref);
      client.expire(host, 1e3 * 60 * 60 * 24); // 1 day
      res.send(ref);
    });
  });
};

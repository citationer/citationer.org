var domain = require("domain");
var express = require("express");

var d = domain.create();

// Yes, yes .. this is bad, but citation.js is still a bit unstable.
d.on("error", function(err) {
  console.error(err);
});

var app = express();

app.disable("x-powered-by");

var config = require("./config.json")[app.get("env")];

if (app.get("env") === "development") {
  app.use(express.errorHandler());
  app.use(express.logger("dev"));
}

// Meh, more convenient than configuring nginx
app.use(express.static(__dirname + "/public"));

require("./routes/index")(app);

d.run(function() {
  app.listen(config.port);
});
console.log("Listening on port", config.port);

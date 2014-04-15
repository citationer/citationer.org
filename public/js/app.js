$(document).ready(function() {
  var input = $("#input");
  var output = $("#output");

  var citations = [];

  function appendCitation(citation) {
      output.append(
          '<div class="citation">'
          + citation
          + '</div>'
      );
  }

  console.log(sessionStorage.getItem("citations"));
  if (sessionStorage.getItem("citations")) {
    citations = JSON.parse(sessionStorage.getItem("citations"));
    citations.forEach(function(citation) {
      appendCitation(citation);
    });
  }

  function saveCitations() {
    sessionStorage.setItem("citations", JSON.stringify(citations));
  }

  function addCitation(citation) {
    var found = false;

    console.log(citations);
    citations.forEach(function(elem) {
      if (elem === citation) {
        found = true;
      }
    });

    if (!found) {
      citations.push(citation);

      appendCitation(citation);
      saveCitations();
    }
  }
  
  function inputAction() {
    var url = input.val();
  
    $.get("/cite?q=" + encodeURIComponent(url))
    .done(function(data) {
      addCitation(data);
    });
  }

  input.on("keypress", function(e) {
    if (e.which === 13) {
      // Enter key
      inputAction();
    }
  });
});

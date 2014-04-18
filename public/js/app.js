$(document).ready(function() {
  var input = $("#input");
  var output = $("#output");
  var submitBtn = $(".submit");
  var citationStatus = $(".citation-status");
  var exportBtn = $(".export");

  var citations = [];

  function appendCitation(citation) {
    var c = citation.replace(/</, "&lt;").replace(/>/, "&gt;");
    output.append(
      '<div class="citation">'
      + c
      + '</div>'
    );
    exportBtn.css("display", "block");
  }

  // Load citations if there are some...
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

  function clearInput() {
    input.val("");
  }
  
  function showLoadingIndicator() {
    citationStatus
    .removeClass("fa-link")
    .addClass("fa-spinner")
    .addClass("spin");
  }

  function hideLoadingIndicator() {
    citationStatus
    .removeClass("fa-spinner")
    .removeClass("spin")
    .addClass("fa-link");
  }

  function inputAction() {
    var url = input.val();

    if (!url) {
      return null;
    }
  
    showLoadingIndicator();
    $.ajax({
      url: "/cite?q=" + encodeURIComponent(url),
      method: "GET",
      timeout: 12000
    })
    .done(function(data) {
      hideLoadingIndicator();
      clearInput();
      addCitation(data);
    })
    .fail(function(err) {
      submitBtn.addClass("error");
      setTimeout(function() {
        submitBtn.removeClass("error");
      }, 1800);
      hideLoadingIndicator();
    });
  }

  input.on("keypress", function(e) {
    if (e.which === 13) {
      // Enter key
      inputAction();
    }
  });
  submitBtn.on("click", inputAction);

  exportBtn.on("click", function() {
    var i = 1;
    var exports = "";

    citations.forEach(function(citation, num) {
      exports += i + ". " + citation.replace(/\n/g, " ") + "\n";
      i++;
    });

    console.log(exports);
    var textArea = $("#export-modal .modal-body textarea");
    textArea.val(exports);


    $("#export-modal").modal("show");
    textArea.on("focus", function() {
      textArea[0].select();

      textArea.on("mouseup", function() {
        textArea[0].onmouseup = null;
        return false;
      });
    });
  });
});

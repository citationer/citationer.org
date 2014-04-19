$(document).ready(function() {
  var input = $("#input");
  var output = $("#output");
  var submitBtn = $(".submit");
  var citationStatus = $(".citation-status");
  var exportBtn = $(".export");

  var citations = [];

  function saveCitations() {
    sessionStorage.setItem("citations", JSON.stringify(citations));
  }

  function appendCitation(citation, index) {
    if (!citation) {
      return;
    }

    var c = citation.replace(/</, "&lt;").replace(/>/, "&gt;");
    output.append(
      '<div class="citation" data-index="' + index + '">'
        + '<div class="content">'
        + c
        + '</div>'
        + '<div class="remove">'
          + '<i class="fa fa-times-circle"> </i>'
        + '</div>'
      + '</div>'
    );
    exportBtn.css("display", "block");
  }

  function enableDeletion() {
    var deleteButtons = $(".citation .remove");

    deleteButtons.on("click", function() {
      $(this).parent().addClass("delete");
      var index = parseInt($(this).parent().attr("data-index"));
      setTimeout(function() {
        citations[index] = null;
        syncCitations();
      }, 1100);
    });
  }

  function syncCitations() {
    $(".citation").remove();
    citations.forEach(function(citation, i) {
      if (citation) {
        appendCitation(citation, i);
      }
    });
    enableDeletion();
    saveCitations();
  }

  // On load, load citations if there are some...
  if (sessionStorage.getItem("citations")) {
    citations = JSON.parse(sessionStorage.getItem("citations"));
    citations.forEach(function(citation, i) {
      appendCitation(citation, i);
    });
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
      syncCitations();
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

    citations.forEach(function(citation) {
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

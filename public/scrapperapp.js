//Grab the articles as a json
$.getJSON('/scrape', function (data) {
    //for each article
    for (var i = 0; i < data.length; i++) {
        //Displa the each article information on the page.
        $("article").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
    //Fade out transition after initial scrap
    var modalBody = $('.modal-body');
    modalBody.fadeOut(function () {
        modalBody.empty();
        modalBody.text(results);
        modalBody.fadeIn();
        if (results != `No new articles at this time... check back later.`) {
            $('<p>').hide().text("Reloading in 5 seconds...").appendTo(modalBody).fadeIn();
            setTimeout(function () {
                location.reload();
            }, 4000)
        }
    })
});

//Whenever someone clicks on a p tag
$(document).on("click", "p", function () {
    //Empty the notes from the note section
    $('#notes').empty();
    $('#articles').hide('blind')
    //Save the id from the p tag
    var thisId = $(this).attr('data-id');

    //Make an ajax call for the article
    $.ajax({
            method: "GET",
            url: "/articles/" + thisId
        })

        //Now, add the API information to the page
        .then(function (data) {
            console.table(data);
            //The article title
            $('#notes').append("<h2>" + data.title + "</h2>");
            //An input to enter a new title
            $('#notes').append("<input id='titleinput' name='title' >");
            //A textarea to add a note to the body
            $('#notes').append("<textarea id='bodyinput' name='body'></textarea>");
            //A button to submit a new note, with the id of the article saved to it
            $('#notes').append("<button data-id='" + data._id + "' id='svenote'>Save Notes</button>");

            $('#savenote').click(function () {
                $('#notes').hide();
                $('#articles').show('blind');
            });

            //If there's a note in the article
            if (data.note) {
                //Place the title of the note in the title input
                $("#titleinput").val(data.note.title);
                //Place the body of the note in the body textarea
                $('#bodyinput').val(data.note.body)
            }
        });
});

// When you click the savenote button
$(document).on("click", "#savenote", function () {
    // Grabs the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");

    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
            method: "POST",
            url: "/articles/" + thisId,
            data: {
                // Value taken from title input
                title: $("#titleinput").val(),
                // Value taken from note textarea
                body: $("#bodyinput").val()
            }
        })
        // With that done
        .then(function (data) {
            // Log the response
            console.log(data);
            // Empty the notes section
            $("#notes").empty();
        });

    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
});


//Captures reply to article
$(".replyBtn").click(event => {
    event.preventDefault();
    var articleId = $(event.target).attr("data-articleId");
    var author = $("#authorField-" + articleId).val().trim();
    var body = $("#noteField-" + articleId).val().trim();
    var data = {
        body: body
    };
    if (author.length > 0) data.author = author;
    $.post('/articles/:id' + articleId, data, resp => {
        location.reload();
    });
});

$(".pin").click(event => {
    var pinned = $(event.target).attr('data-pinned');
    var newPin;
    pinned === "true" ? newPin = false : newPin = true;
    var articleId = $(event.target).attr('data-articleId');
    console.log("id: ", articleId)
    $.post('/pins/:articleId' + articleId, {
        pin: newPin
    }, resp => {
        //console.log(resp)
        location.reload();
    });
});
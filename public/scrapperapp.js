$('.scrape').click(() => {
    //Grab the articles as a json
    $.getJSON('/api/scrape', function (data) {
        //for each article
        var results;
        if (data.results) results = `Successfully scraped ${data.results.length} articles!`;
        else if (data.errors.result.nInserted > 0) {
            results = `Successfully scraped ${data.errors.result.nInserted} articles!`;
        } else results = `No new articles at this time...`;

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
})


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
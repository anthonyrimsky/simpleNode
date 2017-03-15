// Check if user is logged in.
// An user is allowed to add ratings and a guest isn't.
validateLogin(function (user) {
    if (user !== 'token not valid') {
        refreshContent(user);
    }
});

function refreshContent(user) {
    $('#films-list').empty();
    getFilms(user);
}

// Get a list of films from the REST-service and add them to #films-list.
function getFilms(user) {
    $.ajax({
        type: 'GET',
        url: '/films',
        dataType: 'json',
        success: function (data) {
            $.each(data, function (index, element) {
                var div;
                // Request image from omdbapi
                var ttnumber = element.ttnumber;
                var title = element.title;
                // Get poster
                getPoster(ttnumber, function (imgurl) {
                    var release_date = element.release_date;
                    var avg_rating = element.avg_rating;
                    if (avg_rating === null) {
                        avg_rating = "Nog niet beoordeeld"
                    }
                    div = '<div class="col-md-3 col-sm-4" id="' + ttnumber + '">';
                    div += '<img src="' + imgurl + '"><br>';
                    div += title + '<br>';
                    div += release_date + '<br>';
                    div += 'Rating: ' + avg_rating.toFixed(2);
                    div += '</div>';
                    $('#films-list').append(div);
                    // If user is logged in, add current rating to the movie
                    if (user != null) {
                        showRating();
                        function showRating() {
                            getUserRating(ttnumber, function (rating) {
                                var html = '<span class="rating"><br>';
                                if (rating != null) {
                                    // Show current rating
                                    html += "Je rating: ";
                                    html += rating + ' ';
                                    html += '<a class="add-rating" href="#"><img src="includes/images/edit.svg"></a><a class="delete-rating" href="#"><img src="includes/images/delete.svg"></a>';
                                }
                                else {
                                    html += '<a class="add-rating" href="#">Plaats beoordeling</a>';
                                }
                                html += '</span>';
                                $('#' + ttnumber).append(html);
                                // Bind function to href
                                $('#' + ttnumber + ' a.add-rating').click(function () {
                                    $('#add-rating #film-name').text(title);
                                    $('#add-rating').modal();
                                    // Unbind previous onclick (if exists) from the submit button and bind the function again with different values.
                                    $('#submit_rating').off('click').click(function () {
                                        addRating(ttnumber, parseFloat($("#select-rating").val()), function (result) {
                                            // Refresh rating
                                            $('#' + ttnumber + ' span.rating').remove();
                                            showRating();
                                        });
                                        // Hide modal after submit.
                                        $('#add-rating').modal('toggle');
                                    });
                                });
                                // Bind function to delete rating href
                                $('#' + ttnumber + ' a.delete-rating').click(function () {
                                    deleteRating(ttnumber, function () {
                                        // Refresh rating
                                        $('#' + ttnumber + ' span.rating').remove();
                                        showRating();
                                    });
                                });
                            });
                        }
                    }
                });
            });
        }
    });
}

// Add a rating from the current logged in user to the REST-service.
function addRating(ttnumber, rating, callback) {
    $.ajax({
        type: 'PUT',
        url: '/rating/' + ttnumber,
        data: JSON.stringify({"rating": rating}),
        headers: {
            "Authorization": localStorage.getItem("token")
        },
        dataType: 'json',
        contentType: "application/json",
        success: function (result) {
            callback('ok');
        },
        error: function (result) {
            callback('error');
        }
    });
}

// Remove rating from current logged in user. ttnumber is used as parameter.
function deleteRating(ttnumber, callback) {
    $.ajax({
        type: 'DELETE',
        url: '/rating/' + ttnumber,
        headers: {
            "Authorization": localStorage.getItem("token")
        },
        success: function (result) {
            callback();
        },
        error: function (result) {
            callback();
        }
    });
}

// Get rating of current logged in user. ttnumber is used as parameter.
function getUserRating(ttnumber, callback) {
    $.ajax({
        type: 'GET',
        url: '/rating/' + ttnumber,
        headers: {
            "Authorization": localStorage.getItem("token")
        },
        dataType: 'json',
        success: function (rating) {
            if (rating.ratings[0] != undefined) {
                callback(rating.ratings[0].rating);
            }
            else {
                callback(null);
            }
        }
    });
}

// Get poster from the omdbapi.
function getPoster(ttnumber, callback) {
    $.ajax({
        type: 'GET',
        url: 'http://www.omdbapi.com',
        data: {i: ttnumber},
        dataType: 'json',
        success: function (data) {
            callback(data.Poster);
        }
    });
}
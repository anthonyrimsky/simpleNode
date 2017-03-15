validateLogin(function (user) {
    refreshContent(user);
});

function refreshContent(user) {
    $('#user-list').empty();
    if (user != null) {
        getUsers();
    }
    else {
        showNotAllowed();
    }
}

function showNotAllowed() {
    var msg = '<h1>Inloggen vereist</h1>';
    msg += '<p>Gebruikersinformatie is alleen beschikbaar voor ingelogde gebruikers</p>';
    $('#user-list').append(msg);
}

function getUsers() {
    $.ajax({
        type: 'GET',
        url: '/user',
        headers: {
            "Authorization": localStorage.getItem("token")
        },
        contentType: "application/json",
        dataType: 'json',
        success: function (data) {
            var msg = '<div class="col-md-12"><h1>Gebruikersoverzicht</h1></div>';
            $('#user-list').append(msg);
            $.each(data, function (index, element) {
                var username = element.username;
                var first_name = element.first_name;
                var last_name = element.last_name;
                var div = '<div class="col-md-3 col-sm-4 col-xs-6"><p>';
                div += 'Gebruiker: ' + username + '<br>';
                div += 'Naam: ' + first_name + ' ' + last_name + '<br>';
                div += '</p></div>';
                $('#user-list').append(div);
            });
        }
    });
}
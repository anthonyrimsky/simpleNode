function validateLogin(callback) {
    if (localStorage.getItem("token") != null) {
        validateToken(localStorage.getItem("token"), function (user) {
            // Remove token from storage if token isn't valid anymore
            if (user === null) {
                logOut();
                callback('token not valid');
            }
            // Hide login and show logout in navbar
            else {
                $('#navbar-user').removeClass('hidden').text('Hallo ' + user.username);
                $('#navbar-login').addClass('hidden');
                $('#navbar-register').addClass('hidden');
                $('#navbar-logout').removeClass('hidden');
                // Show user info in profile modal
                $('#user-info #username').text(user.username);
                $('#user-info #first-name').text(user.first_name);
                $('#user-info #last-name').text(user.last_name);
                callback(user);
            }
        });
    }
    else {
        $('#navbar-user').addClass('hidden').text('');
        $('#navbar-logout').addClass('hidden');
        $('#navbar-login').removeClass('hidden');
        $('#navbar-register').removeClass('hidden');
        callback(null);
    }
}

function logOut() {
    // Remove token.
    localStorage.removeItem("token");
    // Reset styles and refresh content.
    validateLogin(function () {
        refreshContent();
    });
}

$("#navbar-logout").click(function () {
    logOut();
});

function validateToken(token, callback) {
    $.ajax({
        type: 'GET',
        url: '/user/self',
        headers: {
            "Authorization": token
        },
        contentType: "application/json",
        dataType: 'json',
        success: function (data) {
            callback(data);
        },
        error: function (data) {
            callback(null);
        }
    });
}

function checkCredentials(username, password, callback) {
    $.ajax({
        type: 'POST',
        url: '/login',
        data: JSON.stringify({username: username, password: password}),
        contentType: "application/json",
        dataType: 'json',
        success: function (data) {
            // Save token to local storage
            localStorage.setItem("token", data.token);
            // Refresh content
            validateLogin(function (user) {
                refreshContent(user);
            });
            callback('ok');
        },
        error: function (data) {
            callback('not ok');
        }
    });
}

$("#loginBtn").click(function () {
    var username = $("#username-login");
    var password = $("#password-login");

    // Check if username is entered.
    if (username.val().length === 0) {
        username.parent().addClass('has-error');
        $("#username-login-help").removeClass('hidden');
    }
    // Check if password is entered.
    else if (password.val().length === 0) {
        password.parent().addClass('has-error');
        $("#password-login-help").removeClass('hidden');
    }
    // Login with given username and password.
    else {
        checkCredentials(username.val(), password.val(), function (result) {
            // Hide modal after login
            if (result === 'ok') {
                $("#login").modal('hide');
            }
            else {
                // Show message in modal after incorrect username or password.
                $("#wrong-pass-warning").removeClass('hidden');
            }
        });
    }
});

$("#registerBtn").click(function () {
    var username = $("#username-register");
    var password = $("#password-register");
    var firstname = $("#first-name-register");
    var lastname = $("#last-name-register");
    var preposition = $("#preposition-register");

    $.ajax({
        type: 'POST',
        url: '/register',
        data: JSON.stringify({
            username: username.val(),
            password: password.val(),
            first_name: firstname.val(),
            last_name: lastname.val(),
            preposition: preposition.val()
        }),
        contentType: "application/json",
        dataType: 'json',
        success: function (data) {
            // Hide modal after registration
            $("#register").modal('hide');
            // Auto login after successful registration
            checkCredentials(username.val(), password.val());
            validateLogin();
        },
        error: function (data) {
            // Toon bericht als gebruiker al bestaat.
            if (data.responseJSON === 'Duplicate username') {
                $("#register-error-duplicate").removeClass('hidden');
            }
            // Show message in modal after incorrect username or password.
            else {
                $("#register-error").removeClass('hidden');
            }
        }
    });
});

// Source:
// http://stackoverflow.com/questions/8363802/bind-a-function-to-twitter-bootstrap-modal-close
$('#login').on('hidden.bs.modal', function () {
    // Reset values on login modal close.
    $("#username-login").val('').parent().removeClass('has-error');
    $("#password-login").val('').parent().removeClass('has-error');
    $("#username-login-help").addClass('hidden');
    $("#password-login-help").addClass('hidden');
    $("#wrong-pass-warning").addClass('hidden');
});
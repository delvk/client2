var url = localStorage.getItem("url");
document.getElementById("btn-login").addEventListener("click", function () {
    // console.log(temp_url);
    try {
        var email = document.getElementById("email");
        var password = document.getElementById("password");
        login(url, email.value, password.value);
    } catch (e) {
        alert("something went wrong");
    }
});
document.getElementById("btn-demo").addEventListener("click", function () {
    login(url, "admin@admin.com", "1");
});

function login(url, email, password) {
    url += "/user/login";
    var token;
    if (device.platform == "Android") {
        cordova.plugins.PluginRESTful.login(url, email, password, function (value) {
            token = value.token;
            localStorage.setItem("token", token);
            window.location.replace("library.html");
        }, function (err) {
            alert(err);
        });
    } else {
        var xhttp = new XMLHttpRequest();
        var JSONform = '{"email":"' + email + '","password":"' + password + '"}';
        xhttp.open("POST", url, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send(JSONform);
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var res = JSON.parse(this.response);
                token = res.token;
                localStorage.setItem("token", token);
                window.location.replace("library.html");
            }
        };
    }
}

function goSignup() {
    window.location.replace("signup.html");
}
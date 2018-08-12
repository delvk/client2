var url = localStorage.getItem("url");
document.getElementById("btn-signup").addEventListener("click", function () {
    // console.log(temp_url);
    var info = document.getElementById("info");
    try {
        var email = document.getElementById("email");
        var password = document.getElementById("password");
        var password2 = document.getElementById("password_confirm");
        if (password.value != password2.value) {
            info.innerHTML = "Password do not match, try again";
            return;
        }
        signup(url, email.value, password.value);
    } catch (e) {
        info.innerHTML = "something went wrong";
    }
});

function signup(url, email, password) {
    url += "/user/signup";
    if (device.platform == "Android") {
        cordova.plugins.PluginRESTful.signup(url, email, password, function (value) {
            if (value == "OK") {
                alert("User created");
                window.location.replace("login.html");
            }
            else alert(value);
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
            if (this.readyState == 4 && this.status == 201) {
                alert("User created");
                window.location.replace("login.html");
            }
        };
    }
}

function goLogin() {
    window.location.replace("login.html");
}
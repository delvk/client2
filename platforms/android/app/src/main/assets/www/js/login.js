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
    cordova.plugins.PluginRESTful.login(url, "admin@admin.com", "1", function (value) {
        token = value.token;
        localStorage.setItem("token", token);
        window.location.replace("library.html");
    }, function (err) {
        alert(err);
    });
}
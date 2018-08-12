document.addEventListener("deviceready", function () {
    var SERVER = ["localhost", "192.168.1.101"];
    var PORT = [8080];
    const prefix_http = "http://";
    var url;
    var sv_form = document.getElementById("svname");
    var p_form = document.getElementById("port");
    cb();

    function cb() {
        var a_1 = document.getElementById("a_1");
        var a_2 = document.getElementById("a_2");
        a_1.innerHTML = SERVER[0] + ":" + PORT[0];
        a_2.innerHTML = SERVER[1] + ":" + PORT[0];


        a_1.addEventListener("click", function () {
            sv_form.value = SERVER[0];
            p_form.value = PORT[0];

        })
        a_2.addEventListener("click", function () {
            sv_form.value = SERVER[1];
            p_form.value = PORT[0];

        });
    }

    document.getElementById("connect").addEventListener("click", function () {
        url = (prefix_http + sv_form.value + ":" + p_form.value);
        console.log(url);
        // REF DOC: https://www.w3schools.com/xml/ajax_xmlhttprequest_response.asp
        if (!url) callback("URL incorrect", 404);
        else {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {

                switch (this.readyState) {
                    case 1:
                        callback("server connection established");
                        break;
                    case 2:
                        callback("request received");
                        break;
                    case 3:
                        callback("processing request");
                        break;
                    case 4:
                        if (this.status == 200) {
                            callback("OK", 200);
                            localStorage.setItem("url", url);
                            window.location.replace("login.html");
                        } else callback("can't connect to server", 404);
                        break;
                    default:
                        callback("Request not initialized");
                }
            };
            xhttp.open("GET", url, true);
            // xhttp.setRequestHeader("Content-type", "application/json");
            xhttp.send();
        }

        function callback(res, code) {
            document.getElementById("info").innerHTML = res;
            if (code == 404)
                document.getElementById("info").style.color = "red";
            if (code == 200)
                document.getElementById("info").style.color = "green";

        }

    })

});
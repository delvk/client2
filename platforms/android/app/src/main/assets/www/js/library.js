var link = localStorage.getItem("url") + "/image/library/";
var token = localStorage.getItem("token");
document.addEventListener("deviceready", function () {
    load_img_list(link, token) // Load image first
    function addImage(id, src) { //function: add img in UI
        var holder = document.createElement("div");
        holder.className = "holder";
        var img = document.createElement("img");
        img.src = src;
        holder.appendChild(img);
        var btn_holder = document.createElement("div");
        btn_holder.className = "btn_holder";
        var btn_change, btn_del, btn_download, btn_cancel;
        btn_change = document.createElement("btn");
        btn_change.className = "btn";
        btn_change.innerHTML = "Change";
        btn_change.onclick = function () {
            change_img(id);
        }

        btn_del = document.createElement("btn");
        btn_del.className = "btn";
        btn_del.innerHTML = "Delete";
        btn_del.onclick = function () {
            delete_img(id);
        }

        btn_download = document.createElement("btn");
        btn_download.className = "btn";
        btn_download.innerHTML = "Download";

        btn_cancel = document.createElement("btn");
        btn_cancel.className = "btn";
        btn_cancel.innerHTML = "Cancel";

        btn_holder.appendChild(btn_download);
        btn_holder.appendChild(btn_change);
        btn_holder.appendChild(btn_del);
        btn_holder.appendChild(btn_cancel);

        holder.appendChild(btn_holder);
        holder.onclick = function () {
            toggle(this);
        }

        function toggle(elm) {
            var img = elm.getElementsByTagName("img")[0];
            var holder = elm.lastElementChild;
            if (holder.style.display != "block") {
                img.style.webkitFilter = "opacity(30%)";
                img.style.filter = "opacity(30%)";
                holder.style.display = "block";
            } else {
                img.style.webkitFilter = "none";
                img.style.filter = "none";
                holder.style.display = "none";
            }

        }
        document.body.appendChild(holder);
        console.log(src);

    }
    document.getElementById("create-btn").addEventListener("click", function () { // Create image
        create_img();
    });

    function load_img_list(url, token) { // function: load Image list
        if (device.platform == "browser") {
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET", url, true);
            xhttp.setRequestHeader("authorization", "bearer " + token);
            xhttp.send();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    console.log("auth success");
                    var data = JSON.parse(this.responseText);
                    console.log(data);
                    for (i = data.count - 1; i >= 0; i--) {
                        // funcs[i] = createfunc(i, data);                    
                        getImg(data.images[i].id);
                    }
                } else {
                    console.log(this.responseText);
                }
            };

            function getImg(img_id) {
                var url_image_id = url + img_id;
                var get_request = new XMLHttpRequest();
                get_request.open("GET", url_image_id, true);
                get_request.setRequestHeader("authorization", "bearer " + token);
                get_request.send();
                get_request.onreadystatechange = function () {
                    if (this.readyState == 4) {
                        var temp_src = JSON.parse(this.responseText);
                        addImage(img_id, url + temp_src.src);
                        return;
                    }
                };
            }
        } else if (device.platform == "Android") {
            cordova.plugins.PluginRESTful.load(link, token, success, fail);

            function success(value) {
                for (i = 0; i < value.length; i++) {
                    
                    
                    addImage(value[i].id, link+value[i].src);
                }
            }
            function fail(err){
                console.log("error "+ err);
                
            }
        }
    }

    function create_img() {
        if (device.platform == "Android") {
            navigator.camera.getPicture(create, error, {
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY
            });

            function create(imgLink) {
                var image = document.getElementById('my_img');
                image.src = imgLink;
                var action = "post";
                getFileEntry(imgLink, action);
            }
        } else alert("Not support this platform");
    }

    function change_img(id) {
        if (device.platform == "Android") {
            navigator.camera.getPicture(chooseFileUpdate, error, {
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY
            });

            function chooseFileUpdate(imgLink) {
                var image = document.getElementById('my_img');
                image.src = imgLink;
                var action = "put";
                getFileEntry(imgLink, action, id);
            }
        } else alert("Not support this platform");
    }

    function delete_img(id) {
        var temp = link + id;
        alert(temp);
        var xhttp = new XMLHttpRequest();
        xhttp.open("DELETE", temp, true);
        xhttp.setRequestHeader("authorization", "bearer " + token);
        xhttp.send();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                alert("Your image have been deleted");
                location.reload();
            }
        }
    }

    function getFileEntry(imgUri, action, id) {
        window.resolveLocalFileSystemURL(imgUri, function success(fileEntry) {
            // Do something with the FileEntry object, like write to it, upload it, etc.
            //writeFile(fileEntry, imgUri);
            upload(fileEntry, action, id);
            // displayFileData(fileEntry.nativeURL, "Native URL");

        }, function () {
            // If don't get the FileEntry (which may happen when testing
            // on some emulators), copy to a new FileEntry.
            console.log("No such file");

        });
    }

    function upload(fileEntry, action, id) {
        // REF DOC: https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-file-transfer/
        var fileURL = fileEntry.toURL();
        var success = function (r) {
            console.log("Successful upload...");
            if (r.responseCode) {
                alert("upload successful");
                location.reload();
            } else alert("something wrong");

            // displayFileData(fileEntry.fullPath + " (content uploaded to server)");
        }
        var fail = function (error) {
            alert("An error has occurred: Code = " + error.code);
        }
        var options = new FileUploadOptions();
        options.fileKey = "img";
        options.trustAllHosts = true;
        options.headers = {
            'authorization': "bearer " + token
        };
        var SERVER = link;
        if (action == "post") {
            options.httpMethod = "POST";
        }

        if (action == "put") {
            options.httpMethod = "PUT";
            SERVER += id;
        }

        // options.fileName = "logo.png"
        //options.mimeType = "text/plain";
        // var params = {};
        // params.value1 = "test";
        // params.value2 = "param";
        // options.params = params;

        var ft = new FileTransfer();
        // SERVER must be a URL that can handle the request, like
        ft.upload(fileURL, encodeURI(SERVER), success, fail, options);
    };

    function error(err) {
        alert("Something went wrong");
    }
    // 1 = FileTransferError.FILE_NOT_FOUND_ERR
    // 2 = FileTransferError.INVALID_URL_ERR
    // 3 = FileTransferError.CONNECTION_ERR
    // 4 = FileTransferError.ABORT_ERR
    // 5 = FileTransferError.NOT_MODIFIED_ERR
});


/* When the user clicks on the button, 
toggle between hiding and showing the dropdown content */
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('.dropbtn')) {

        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}
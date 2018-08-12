cordova.define("jake-cordova-plugin-restful.PluginRESTful", function(require, exports, module) { var exec = require('cordova/exec');

exports.login = function (url, email, pwd, success, error) {
    exec(success, error, 'PluginRESTful', 'login', [url, email, pwd]);
};
exports.load = function (url, token, success, error) {
    exec(success, error, 'PluginRESTful', 'load', [url, token]);
};
exports.delete = function (url, token, success, error) {
    exec(success, error, 'PluginRESTful', 'delete', [url, token]);
};
exports.signup = function (url, email, pwd, success, error) {
    exec(success, error, 'PluginRESTful', 'signup', [url, email, pwd]);
};
});

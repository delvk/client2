cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/jake-cordova-plugin-restful/www/PluginRESTful.js",
        "id": "jake-cordova-plugin-restful.PluginRESTful",
        "pluginId": "jake-cordova-plugin-restful",
        "clobbers": [
            "cordova.plugins.PluginRESTful"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.3.3",
    "jake-cordova-plugin-restful": "0.0.1"
}
// BOTTOM OF METADATA
});
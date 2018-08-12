cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "jake-cordova-plugin-restful.PluginRESTful",
    "file": "plugins/jake-cordova-plugin-restful/www/PluginRESTful.js",
    "pluginId": "jake-cordova-plugin-restful",
    "clobbers": [
      "cordova.plugins.PluginRESTful"
    ]
  },
  {
    "id": "cordova-plugin-device.device",
    "file": "plugins/cordova-plugin-device/www/device.js",
    "pluginId": "cordova-plugin-device",
    "clobbers": [
      "device"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-whitelist": "1.3.3",
  "jake-cordova-plugin-restful": "0.0.1",
  "cordova-plugin-device": "2.0.2"
};
// BOTTOM OF METADATA
});
var fs = require("fs"),

window = require("jsdom").jsdom().createWindow();
window.eval(fs.readFileSync(__dirname + "/lib/swaggersocket.js", "utf-8"));
window.atmosphere = require("atmosphere-client");

module.exports = window.swaggersocket;

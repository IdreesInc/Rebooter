var fs = require("fs");
var shelljs = require('shelljs');
var dns = require('dns');
var intercept = require("intercept-stdout");

var connectionAttempts = 0;
var config = JSON.parse(fs.readFileSync(__dirname + '/config.json', 'utf8'));

var unhook_intercept = intercept(function(txt) {
	var time = new Date().toLocaleString().split(", ")[1];
	return "[" + time + "] (Rebooter)  " + txt;
});

var callback = function (connected) {
	if (config.enabled) {
		if (!connected) {
			connectionAttempts++;
			if (connectionAttempts == 1 || connectionAttempts % config.mod_attempts_to_print === 0) {
				console.log("Error: Unable to connect to the internet. Attempt #" + connectionAttempts + " out of " + config.max_connection_attempts);
			}
			if (connectionAttempts == config.max_connection_attempts - 1) {
				console.log("Warning: Reboot on next failed connection attempt");
			} else if (connectionAttempts == config.max_connection_attempts) {
				rebootDevice();
			}
			setTimeout(function() { checkInternet(callback); }, config.disconnected_request_rate);
		} else {
			if (connectionAttempts > 1) {
				connectionAttempts = 0;
				console.log("Crisis averted, internet restored!");
			}
			setTimeout(function() { checkInternet(callback); }, config.standard_request_rate);
		}
	}
};

setTimeout(function() { checkInternet(callback); }, config.standard_request_rate);

console.log("Rebooter program activated!");
checkInternet(function (connected) {
	if (connected) {
		console.log("Internet currently connected!");
	} else {
		checkInternet(callback);
	}
});
console.log(config);

/**
 * Checks if the internet is connected by pinging google.
 * @param  {Function} cb Callback that is given a boolean parameter that is true if connected and false if an error occurred
 */
 function checkInternet(cb) {
 	dns.lookup('google.com',function(err) {
 		if (err && err.code == "ENOTFOUND") {
 			cb(false);
 		} else {
 			cb(true);
 		}
 	});
 }

/**
 * Restarts the device through 'sudo reboot now'.
 */
 function rebootDevice() {
 	console.log("Rebooting...");
 	shelljs.exec("sudo reboot now");
 }

/**
 * Returns the formatted time.
 * @return {String} The time, formatted to look all nice and pretty-like
 */
 function getTime() {
 	return "[" + new Date().toLocaleString().split(", ")[1] + "]";
 }
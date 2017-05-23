# Rebooter
A quick and dirty Node.js program that reboots my Raspberry Pi server if it disconnects for too long.

### Config Explanation
```javascript
{
	"enabled": true,
	"standard_request_rate": 10000, // The standard rate to ring up "google.com" (in milliseconds)
	"disconnected_request_rate": 1000, // The rate to request from "google.com" when the internet has been detected as disconnected
	"max_connection_attempts": 600, // The maximum number of connection attempts to try before rebooting
	"mod_attempts_to_print": 30 // When to print the number of failed attempts to console [if (connection_attempts % mod_attempts_to_print === 0)]
}
```

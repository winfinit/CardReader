# CardReader.js
===========

A simple jQuery plugin to detect and read the input of a magnetic stripe
card reader or similar device identified by the OS as a Human Interface Device.

## .cardReader(options, callback(err, data))
### options
* Type: PlainObject
A set of key/value pairs that allow one to override track info

#### error_start (default: "é")
	* Type: String
	Character that is returned by a reader that identifies an error

#### track_start (default: "%")
	* Type: String
	Character that identifies beginning of the read

#### track_end (default: "_")
	* Type: String
	Character that identifies end of the string

#### timeout (default: 100)
	* Type: Number
	Set a timeout (in milliseconds) for release of cursor in case of unexpected behaviour

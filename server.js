// Global vars and useful module imports

var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var cache = {};

// End of Globals

// Functions for handling http requests
// 404 Page doesn't exist error
function send404(res){
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write('Error 404: resource not found.');
    respond.end();
}
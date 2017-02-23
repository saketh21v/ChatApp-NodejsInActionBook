// Global vars and useful module imports

var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var cache = {};

// End of Globals

// Functions for handling http requests
// 404 Page doesn't exist error
function send404(response){
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.write('Error 404: resource not found.');
    response.end();
}

// File send function
function sendFile(response, filePath, fileContents){
    response.writeHead(
        200,
        {'Content-Type': mime.lookup(path.basename(filePath))}
    );
    response.end(fileContents);
}

// Serve static files after storing in cache
function serveStatic(response, cache, absPath){
    if(cache[absPath]){
        sendFile(response, absPath, cache[absPath]);
    } else{
        fs.exists(absPath, function(exists){
            if(exists){
                fs.readFile(absPath, function(err, data){
                    if(err){
                        send404(response);
                    } else{
                        cache[absPath] = data;
                        sendFile(response, absPath, cache[absPath]);
                    }
                });
            } else{
                send404(response);
            }
        });
    }
}

// Server object 
var server = http.createServer(function(request, response){
    console.log("Received a request. Serving...");
    var filePath = false;
    if(request.url == '/'){
        filePath = 'public/index.html';
    } else{
        filePath = 'public/'+request.url;
    }
    var absPath = './'+filePath;
    serveStatic(response, cache, absPath);
    console.log("Done.");
    console.log("Server listening on port 3000...");
});

// Starting the server
server.listen(3000, function(){
    console.log("Server listening on port 3000.");
});
/*jshint node:true*/
'use strict';

var express = require('express');
var app = express();
/**
 * Node.js body parsing middleware.
 * Parse incoming request bodies in a middleware before your handlers, availabe under the req.body property.
 * @type {Parsers}  https://www.npmjs.com/package/body-parser
 */
var bodyParser = require('body-parser');
//File Compression
var compress = require('compression');
/**
 * middleware for dynamically or statically enabling CORS in express/connect applications
 * Cross Origin Resource Sharing (CORS) allows us to use Web applications within browsers when domains aren’t the same.
 * http://restlet.com/blog/2015/12/15/understanding-and-using-cors/
 * @type {middlewareWrapper} https://www.npmjs.com/package/cors
 */
var cors = require('cors');
//custom error handler
var errorHandler = require('./routes/utils/errorHandler')();
//favicon serving middleware with caching https://www.npmjs.com/package/serve-favicon
var favicon = require('serve-favicon');
//HTTP request logger middleware for node.js https://www.npmjs.com/package/morgan
var logger = require('morgan');
//the port picked from the enviroment variable
var port = process.env.PORT;
var routes;
//the enviroment to serve up weather dev or build
var environment = process.env.NODE_ENV;


/**
 * Bind application-level middleware to an instance of the app object by using
 * the app.use() and app.METHOD() functions, where METHOD is the HTTP method of
 * the request that the middleware function handles (such as GET, PUT, or POST)
 * in lowercase. This example shows a middleware function with no mount path.
 * The function is executed every time the app receives a request.
 * var app = express()
 *
 * app.use(function (req, res, next) {
 * console.log('Time:', Date.now())
 * next()
 * })
 */
//the location of the favicon
app.use(favicon(__dirname + '/favicon.ico'));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: true
}));
// parse application/json
app.use(bodyParser.json());
app.use(compress());
app.use(logger('dev'));
app.use(cors());
app.use(errorHandler.init);

/**
 * The routes we are using for rest API
 */
routes = require('./routes/index')(app);

console.log('About to crank up node');
console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);

app.get('/ping', function(req, res, next) {
    console.log(req.body);
    res.send('pong');
});
/**
 * This swtich statement moves us between
 * development files and build files
 * To serve static files such as images, CSS files, and JavaScript files,
 * the express.static built-in middleware function in Express.
 * Pass the name of the directory that contains the static assets
 * to the express.static middleware function to start serving the files
 * For example, use the following code to serve images,
 * CSS files, and JavaScript files in a directory named public:
 * app.use(express.static('public'))
 */
switch (environment) {
    case 'build':
        console.log('** BUILD **');
        app.use(express.static('./build/'));
        app.use('/*', express.static('./build/index.html'));
        break;
    default:
        console.log('** DEV **');
        app.use(express.static('./src/client/'));
        app.use(express.static('./'));
        app.use(express.static('./tmp'));
        app.use('/*', express.static('./src/client/index.html'));
        break;
}

app.listen(port, function() {
    console.log('Express server listening on port ' + port);
    console.log('env = ' + app.get('env') +
                '\n__dirname = ' + __dirname +
                '\nprocess.cwd = ' + process.cwd());
});

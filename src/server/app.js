/*jshint node:true*/
'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var compress = require('compression');
var cors = require('cors');
var errorHandler = require('./routes/utils/errorHandler')();
var favicon = require('serve-favicon');
var logger = require('morgan');
var port = process.env.PORT || 7203;
//so we can use a glob pattern to serve up the build
//index page because versioning changes the values
const glob = require("glob");

var routes;

var environment = process.env.NODE_ENV;

app.use(favicon(__dirname + '/favicon.ico'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(compress());
app.use(logger('dev'));
app.use(cors());
app.use(errorHandler.init);

//requiring the index.js as the route provider and
//injecting it with the referece to express
routes = require('./routes/index')(app);

console.log('About to crank up node');
console.log('PORT=' + port);
console.log('NODE_ENV=' + environment);

app.get('/ping', function(req, res, next) {
    console.log(req.body);
    res.send('pong');
});

switch (environment) {
    case 'build':
        console.log('** BUILD **');
        /**
         * We are using glob here to get the diff version names of the
         * index-*.html page that is being served up our build file
         */
        glob("./build/*index-*.html",function (er, files) {
            console.log("Globbed index page " +files[0]);
            app.use(express.static('./build/'));
            //set the root path file to serve up
            app.get('/', function(req, res){
                res.sendfile(files[0]);
            });
            startServer();

        });


        break;
    default:
        console.log('** DEV **');
        app.use(express.static('./src/client/'));
        app.use(express.static('./'));
        app.use(express.static('./tmp'));
        app.use('/*', express.static('./src/client/index.html'));
        startServer();
        break;
}

function startServer() {
    app.listen(port, function() {
        console.log('Express server listening on port ' + port);
        console.log('\n__dirname = ' + __dirname +
            '\nprocess.cwd = ' + process.cwd());
    });
}


/**
 * Created by jjenkins on 11/9/2016.
 * gulpfile.js configuration file
 */
module.exports = function () {
    //root for client
    const client ='./src/client/';
    const clientApp = client + 'app/';
    const temp = './.tmp/';
    const server = './src/server/';
    const root ='./';
    const config = {

        /**
         * Files paths
         */
        alljs: [
            './src/**/*.js',
            './*.js'
        ],
        build: './build/',
        client: client,
        css: temp + 'styles.css',
        fonts: './bower_components/font-awesome/fonts/**/*.*',
        html: clientApp+'**/*.html',
        htmltemplates: clientApp + '**/*.html',
        images: client +'images/**/*.*',
        //index html file
        index: client+'index.html',
        //the path to the js to be injected
        //the ! char us used to denote not included
        js: [
            clientApp + '**/*.module.js',
            clientApp + '**/*.js',
            '!' + clientApp + '**/*.spec.js'
        ],
        server: server,
        temp: temp,
        root: root,
        /**
         * optimized files
         */
        optimized: {
            app: 'app.js',
            lib: 'lib.js'
        },
        /**
         * template cache
         */
        templateCache: {
            file: 'templates.js',
            options: {
                module: 'app.core',
                standAlone: false,
                root: 'app/'
            }
        },
        /**
         * browser sync
         */
        browserReloadDelay: 1000,
        //location of less file
        less: client + 'styles/styles.less',
        /**
         * Bower and npm locations
         */
        bower: {
            json: require('./bower.json'),
            directory: './bower_components/',
            ignorePath: '../..'
        },
        packages : [
            './package.json',
            './bower.json'
        ],

        /**
         * Node settings
         */
        defaultPort: 7203,
        nodeServer: './src/server/app.js'
    };

   config.getWiredepDefaultOptions = function (){
        const options={
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignorePath
        };

        return options;
    };
    return config;
};

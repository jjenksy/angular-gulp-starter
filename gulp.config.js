/**
 * Created by jjenkins on 11/9/2016.
 * gulpfile.js configuration file
 */
module.exports = function () {
    //root for client
    const client ='./src/client/';
    const config = {

        temp:'./.temp/',
        //all the js we want to vet
        alljs: [
            './src/**/*.js',
            './*.js'
        ],
        //location of less file
        less: client + 'styles/styles.less'
    };

    return config;
};

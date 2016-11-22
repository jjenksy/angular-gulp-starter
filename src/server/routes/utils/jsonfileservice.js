/**
 * This module reads and writes to json files
 * @returns {{getJsonFromFile: getJsonFromFile, saveJsonToFile: saveJsonToFile}}
 */

module.exports = function() {
    var service = {
        getJsonFromFile: getJsonFromFile,
        saveJsonToFile : saveJsonToFile
    };
    return service;

    /**
     * Get the file json data
     * @param file
     * @returns {*}
     */
    function getJsonFromFile(file) {
        let fs = require('fs');
        let json = getConfig(file);
        return json;

    }

    /**
     * Save new data to the json file
     * @file
     * @data
     */
    function saveJsonToFile(file, data) {
        //get the file data
        let json = setConfig(file, data);

        return json;
    }
    /**
     * Save new data to the json file
     * @file
     * @data
     */
    function saveJsonToFile(file, data) {
        //get the file data
        let json = setConfig(file, data);

        return json;
    }

    /**
     * Get the file path
     * @param file the path to the file
     */
    function getConfig(file) {
        let filepath = __dirname + file;
        return readJsonFileSync(filepath);
    }

    /**
     * Get the file path
     * @param file the path to the file
     */
    function setConfig(file, data) {
        let filepath = __dirname + file;
        return setJsonFileSync(filepath, data);
    }

    /**
     * Read the json file
     * @filepath the path
     * @encoding the default encoding
     */
    function readJsonFileSync(filepath, encoding) {
        //require the file reader
        let fs = require('fs');
        //get the file
        let file = fs.readFileSync(filepath, encoding);
        if (typeof (encoding) === 'undefined') {
            encoding = 'utf8';
        }
        return JSON.parse(file);
    }

    /**
     * Set the new json file data that is appended to the file
     * @filepath
     * @data
     */
    function setJsonFileSync(filepath , data) {
        let fs = require('fs'),
            configJSON,
            newFile;
        //read the file
        let file = fs.readFileSync(filepath ,'utf8');
        //parse the contents to JSON into javascript
        let config = JSON.parse(file);
        //push the new data into the file
        console.log(config);
        config.push(data);
        //converts a JavaScript value to a JSON string,
        configJSON = JSON.stringify(config);
        //write out the new contents of the file
        fs.writeFileSync(filepath, configJSON, function(error) {
                    console.log('The write file error is: ' + error);
                });//end write the file

        return configJSON;
    }
};

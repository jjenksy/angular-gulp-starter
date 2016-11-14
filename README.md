# angular-gulp-starter
Bootstrap for Gulp build tool. This repo is the setup I am currently using for the Angular and Gulp build tool projects.


## Requirements

- Install Node

## Quick Start
Once repo is cloned type the below in the command prompt
```bash
$ npm install
$ bower install
$ npm start
```

##Running Gulp Commands

```bash
$ gulp serve-build
$ gulp serve-dev
$ gulp bump
```
The serve-build gulp tasks minifies, concatenates and injects the links into the new index.html 
file under the build area. It then start the Node server @src/server/app.js in build mode. 

The serve-dev starts up the server in dev mode serving up the dev files

Bump increments the major, minor, patch and pre-release version numbers. 
* --type=pre will bump the prerelease version *.*.*-x
 * --type=patch or no flag will bump the patch version *.*.x
 * --type=minor will bump the minor version *.x.*
 * --type=major will bump the major version x.*.*
 * --version=1.2.3 will bump to a specific version and ignore other flags





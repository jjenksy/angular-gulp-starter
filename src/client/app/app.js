(function() {

    'use strict';
//setter to declare the module and inject the directives
 const app = angular.module('app', [
    //injectables
     "ngRoute"
    ]);

    //config for app runs this when app is initially created
    app.config(function($routeProvider){

        //describe the route when user navigates
        $routeProvider
            .when('/',{
                templateUrl:"layout/index.html",
                controller:'ProductListCtrl'
            })//@otherwise if you dont know the url
            .otherwise({redirectTo:"/"})

    });
})();

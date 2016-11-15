/*
 * Root app for angular app
 */
(function () {
    'use strict';
    const app = angular.module('app',
        ['common.services',
        'ngRoute']);

    //config for app runs this when app is initially created
    app.config(function($routeProvider) {
        //describe the route when user navigates to /main
        $routeProvider
            .when('/', {
                templateUrl: 'app/welcomeView.html'
            })
            .when('/products',{
                templateUrl: 'app/products/productListView.html',
                controller: 'ProductListCtrl', //determines the controller for the templateURL vie
                controllerAs:'vm'
            })
            .when('/products/edit/:productId',{
                templateUrl: 'app/products/productEditView.html',
                controller: 'ProductEditCtrl', //determines the controller for the templateURL vie
                controllerAs:'vm'
            })
            .when('/products/:productId',{//gets the product ID from the ng-href
                templateUrl: 'app/products/productDetailView.html',
                controller: 'ProductDetailCtrl', //determines the controller for the templateURL vie
                controllerAs:'vm',
                //the resolve function that gets the product
                // and returns the promise to send to the controller
                resolve: {//todo fix this resolve bullshit
                    product: ['contentPromise', function (contentPromise) {
                        return contentPromise();
                    }]
                }
            })
            .otherwise({redirectTo:'/'});//@otherwise if you dont know the url

    });
}());

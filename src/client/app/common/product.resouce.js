/**
 * Created by jjenkins on 11/14/2016.
 * This module queries the backend server and
 * pulls in the specified resource data
 */
(function () {
    'use strict';

    angular
        .module('common.services')
        .factory('productResource',
            ['$resource', function ($resource) {
            let productResource = function productResource(productById) {
                return $resource('/api/productById/' + productById);
            };
            return productResource;
        }]);

    angular
        .module('common.services')
        .factory('productResources',
            ['$resource',
                productResources]);

    function productResources($resource) {
        return $resource('/api/products');
    }
    angular
        .module('common.services')
        .factory('contentPromise', ['productResource', '$route', function (productResource, $route) {
        return function() {
            return productResource($route.current.params.productId).get().$promise;
        };
    }]);

}());

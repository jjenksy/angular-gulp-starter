/**
 * Created by jjenkins on 11/14/2016.
 */
(function () {
    "use strict";

    angular.module('common.services')
        .factory("productResource", ["$resource",productResource]);

    function productResource() {
        //returns a resource object with the url of the
        //products
        return $resource("/api/products/:productId");
    }

}());

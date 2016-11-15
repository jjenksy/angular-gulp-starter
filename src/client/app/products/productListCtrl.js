/**
 * John Jenkins
 */
(function () {
    'use strict';
    angular
        .module('app')
        .controller('ProductListCtrl',
            ['productResources',
                ProductListCtrl]);

    /**
     * THis controller uses the query from productResource then it is injected in the controller and
     * returns the data to update the view
     * @productResource
     * @constructor
     */
    function ProductListCtrl(productResources) {
        //the view
        var vm = this;

        productResources.query(function(data) {
            vm.products = data;
        });
        vm.showImage = false;

        vm.toggleImage = function() {
            vm.showImage = !vm.showImage;
        };
    }
}());

/**
 * The product detail controller
 */
(function () {
    'use strict';

    angular
        .module('app')
        .controller('ProductDetailCtrl',
                    ['product',
                     ProductDetailCtrl]);

    function ProductDetailCtrl(product) {
        var vm = this;

        vm.product = product;

        vm.title = 'Product Detail: ' + vm.product.productName;
        if (vm.product.tags) {
            vm.product.tagList = vm.product.tags.toString();
        }
    }
}());

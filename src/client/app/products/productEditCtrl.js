/**
 * Created by Deb on 8/26/2014.
 */
(function () {
    'use strict';

    angular
        .module('app')//look up the module
        .controller('ProductEditCtrl',//register the controller with the app module
            ['product', //the param for the function from the resolve feature
                '$state',
                    'toastr',
                    'productService',
                ProductEditCtrl]);

    /**
     *
     * @product this var is injected in from the resolve property from the app controller
     * @$state inject the state in the contructor
     * @constructor where the deps are injected
     */
    function ProductEditCtrl(product, $state, toastr, productService) {
        var vm = this;
        console.log('ProductEditCtrl');
        //assign the product to the model vm.product the we use in the view
        vm.product = product;
        vm.priceOption = 'percent';

        //set the margin percent
        //we use a function here so it will recalculate when price
        //or cost changes
        vm.marginPercent = function () {
            return productService.calculateMarginPercent(vm.product.price,
            vm.product.cost);
        };

        /* Calculate the price based on a markup */
        vm.calculatePrice = function () {
            var price = 0;

            if (vm.priceOption == 'amount') {
                price = productService.calculatePriceFromMarkupAmount(
                    vm.product.cost, vm.markupAmount);
            }

            if (vm.priceOption == 'percent') {
                price = productService.calculatePriceFromMarkupPercent(
                    vm.product.cost, vm.markupPercent);
            }
            vm.product.price = price;
        };
        //if it has and Id the it is existing so title is edit
        if (vm.product && vm.product.productId) {
            vm.title = 'Edit: ' + vm.product.productName;
        }
        else {
            //if there is no Id the title is New Product
            vm.title = 'New Product';
        }
        //method bound to the dom to open and close and open the date picker
        // todo fix issue with open datepicker
        vm.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();
            //toggle the boolean for showing the datepicker
            vm.opened = !vm.opened;
            console.log(vm.opened);
        };

        vm.submit = function (isValid) {
            if (isValid) {
                toastr.success('Save Successful');
            }else {
                toastr.error('Save Error');
            }
            //todo uncomment this to save the data to the server not saving now so it want refresh
            // vm.product.$save(function (data) {
            //         toastr.success('Save Successful');
            //         console.log(data);
            //     }
            // );
        };

        vm.cancel = function () {
            //$state.go will navigate to a diff controller
            $state.go('productList');
        };

        /**
         * Takes in a list of tags the user enters
         * @tags the array of tags
         */
        vm.addTags = function (tags) {
            let array = [];
            //if tags are not undefined
            if (tags) {
                //split the list at the comma
                array = tags.split(',');
                //append the list
                vm.product.tags = vm.product.tags ? vm.product.tags.concat(array) : array;
                //clear the property
                vm.newTags = '';
            } else {
                alert('Please enter one or more tags separated by commas');
            }
        };

        vm.removeTag = function (idx) {
            vm.product.tags.splice(idx, 1);
        };

    }
}());

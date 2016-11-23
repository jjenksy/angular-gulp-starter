(function () {
    'use strict';
    const app = angular.module('app',
        ['common.services',
            'ui.router',
            'ui.mask',
            'ui.bootstrap',
            'ngAnimate',
            'toastr',
            'angularCharts'
        ]);

    //changing to UI-router from ngroute test
    app.config(['$stateProvider',
        '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider.otherwise('/');

            $stateProvider
                .state('home', {
                    url: '/',
                    templateUrl: 'app/welcomeView.html'
                })
                // Products
                .state('productList', {
                    url: '/products',
                    templateUrl: 'app/products/productListView.html',
                    controller: 'ProductListCtrl as vm'
                })//parent state for the nested routes
                .state('productEdit', {
                    abstract: true,//this state cannot be activated directly thats what abstract means
                    url: '/products/edit/:productId',
                    templateUrl: 'app/products/productEditView.html',
                    controller: 'ProductEditCtrl as vm',
                    resolve: {
                        productResource: 'productResource',

                        product: function (productResource, $stateParams) {
                            var productId = $stateParams.productId;
                            console.log(productId);
                            return productResource(productId).get().$promise;
                        }
                    }
                })//nested states for product edit when a nested state is activated the parent state is also activated
                .state('productEdit.info', {
                    url: '/info',
                    templateUrl: 'app/products/productEditInfoView.html'
                })
                .state('productEdit.price', {
                    url: '/price',
                    templateUrl: 'app/products/productEditPriceView.html'
                })
                .state('productEdit.tags', {
                    url: '/tags',
                    templateUrl: 'app/products/productEditTagsView.html'
                })//end nested states for product detail

                .state('productDetail', {
                    url: '/products/:productId',
                    templateUrl: 'app/products/productDetailView.html',
                    controller: 'ProductDetailCtrl as vm',
                    resolve: {
                        productResource: 'productResource',

                        product: function (productResource, $stateParams) {
                            var productId = $stateParams.productId;
                            console.log(productId);
                            return productResource(productId).get().$promise;
                        }
                    }
                })
                .state('priceAnalytics',{
                    url: '/price',
                    templateUrl: 'app/price/priceAnalyticsView.html',
                    contoller:'PriceAnalyticsCtrl',
                    resolve: {//todo fix the resolve
                        productResource: 'productResources',
                        //resolve all the product data before navigating to the view
                        product: function (productResources) {
                            return productResources.query().$promise;
                        }
                    }
                });

        }]
    );

}());

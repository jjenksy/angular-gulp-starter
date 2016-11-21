(function () {
    'use strict';
    const app = angular.module('app',
        ['common.services',
            'ngRoute',
            'ui.router',
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
                })
                .state('productEdit', {
                    abstract: true,
                    url: '/products/edit/:productId',
                    templateUrl: 'app/products/productEditView.html',
                    controller: 'ProductEditCtrl as vm',
                    resolve: {
                        product: ['contentPromise', function (contentPromise) {
                                                return contentPromise();
                                            }]
                    }
                })
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
                })

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
                });

        }]
    );

}());

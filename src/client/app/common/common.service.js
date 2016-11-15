/**
 * Created by jjenkins on 11/14/2016.
 * This app registers the common services with angular
 */
(function () {
    'use strict';
    // ngResource is the module wiht the $resource service
    //we a registering the module with the angular setter
    angular
        .module('common.services',
                    ['ngResource']);

}());

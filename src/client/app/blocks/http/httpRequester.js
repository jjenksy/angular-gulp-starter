/**
 * Created by jjenkins on 10/29/2016.
 * todo look at the http resource service available from angular
 */
(function(){

    var httpRequester = function($http, $log){

        var getHttpRequest = function(request){

            return $http.get(request)
                .then(function(response) {
                    //returns http response data
                    $log.info(response.data);
                    return response.data;
                }).catch(function(response){
                    //catch any exception thrown
                    $log.info(response.status);
                });
        };
        return {
            getHttpRequest:getHttpRequest
        };
        };

        //get the current module
    var module = angular.module('app');
    //call the factory function to create the service
    module.factory("httpRequester", httpRequester);
}());

'use strict';

var myApp = angular.module('myApp', [
    'ngRoute',
    'ngStorage',
//    Directives
    'nvd3',
    
//    Services
    'User',
    'StockService',

//    Online plugins


//    Controllers
    'HomePageController',
    'NavBarController',
    
////    The last item on the list can't have a comma
    'loginController'
]);

myApp.config(["$httpProvider",
    function($httpProvider){
        $httpProvider.interceptors.push(function($location) {
    return {
        response: function(response) {
        // do something on success return response;
            return response;
        },
        responseError: function(response) {
            if (response.status === 401)
                $location.url('/login');
                // return $q.reject(response);
            }
        };
      });
}])



myApp.config(["$routeProvider", "$locationProvider",
   function($routeProvider, $locationProvider) {
      $routeProvider.
      
//      Home Page
      when('/', {
            templateUrl: "/app/components/home.html",
            controller: "HomePageController"
        }).
      
      
//====================================================================================
//USERS      
      
//      Signup Page
      when('/signup', {
            templateUrl: "/app/components/signup.html",
            controller: "loginController"
        }).
      
//      Login Page
      when('/login', {
            templateUrl: "/app/components/login.html",
            controller: "loginController"
        }).
       
       otherwise("/", {
           templateUrl: "/app/components/home.html",
           controller: "homePageController"
       });
      
       
       $locationProvider.html5Mode(true)
}]);

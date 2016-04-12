var loginController = angular.module("loginController", []);

loginController.controller("loginController", ["$scope", "$http", "$location", "$sessionStorage", "$route", "$routeParams", "$rootScope", "User", function($scope, $http, $location, $sessionStorage, $route, $routeParams, $rootScope, User){
    
    var str = $route.current.$$route.originalPath
    var title = str.substr(str.indexOf("/") + 1);
    console.log(title)
    $rootScope.pageTitle = "My App - " + title;
    
    console.log("Login Controller");
    
         
}])
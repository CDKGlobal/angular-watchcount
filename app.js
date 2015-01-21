'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.view1',
    'myApp.view2',
    'myApp.version',
    'angular.watchcount'
]).
config(['$routeProvider', 'watchCountConfig', function($routeProvider, watchCountConfig) {
    watchCountConfig.run = true;
    $routeProvider.otherwise({
        redirectTo: '/view1'
    });
}]);

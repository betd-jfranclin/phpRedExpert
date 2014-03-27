var App = angular.module('myApp', ['ngRoute', 'ui.bootstrap', 'jmdobry.angular-cache'])
    .constant('config', CONFIG)
    .config(['$interpolateProvider', function($interpolateProvider) {
        $interpolateProvider.startSymbol('{[').endSymbol(']}');
    }]);

/*
 * Allow change location without firing route
 * @see https://github.com/angular/angular.js/issues/1699#issuecomment-36637748
 */
App.run(['$route', '$rootScope', '$location', 
    function ($route, $rootScope, $location) {
        var original = $location.path;
        $location.path = function (path, reload) {
            if (reload === false) {
                var lastRoute = $route.current;
                var un = $rootScope.$on('$locationChangeSuccess', function () {
                    $route.current = lastRoute;
                    un();
                });
            }
            
            return original.apply($location, [path]);
        };
    }
]);

// Router

App.config(['$routeProvider', '$locationProvider', 'config', 
    function($routeProvider, $locationProvider, config) {
        $locationProvider.hashPrefix('!');
        $routeProvider.
            when('/', {
                templateUrl: config.assetsUri + 'partials/dashboard.html',
                controller: 'DashboardController'
            }).
            when('/server/:serverId/', {
                templateUrl: config.assetsUri + 'partials/dashboard.html',
                controller: 'DashboardController'
            }).
            when('/server/:serverId/db/:dbId/', {
                templateUrl: config.assetsUri + 'partials/search.html',
                controller: 'SearchController'
            }).
            when('/server/:serverId/db/:dbId/search/:pattern?/:page?', {
                templateUrl: config.assetsUri + 'partials/search.html',
                controller: 'SearchController'
            }). 
            when('/server/:serverId/clients', {
                templateUrl: config.assetsUri + 'partials/clients.html',
                controller: 'ClientsController'
            }).
            otherwise({
                redirectTo: '/'
            });
    }]
);

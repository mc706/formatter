var app = angular.module('formatterApp', []);

app.config(function ($routeProvider) {
    "use strict";
    $routeProvider
        .when('/',
        {
            controller: 'FormatController',
            templateUrl: 'app/views/formatter.html'
        })
        .otherwise({redirectTo: '/'});
});
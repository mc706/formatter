
var app = angular.module('formatterApp',[]);

app.config(function($routeProvider){
    $routeProvider
        .when('/',
            {
                controller:'FormatController',
                templateUrl:'app/views/formatter.html'
            })
        .otherwise({redirectTo:'/'});
});
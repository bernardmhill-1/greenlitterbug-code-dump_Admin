angular.module('appRoutes', ['ui.router'])
  .config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: '../public/client/views/pages/login.html'
        })
        .state('signup', {
            url: '/signup',
            templateUrl: '../public/client/views/pages/signup.html',
            controller:'UserSignupController'
        })

    $locationProvider.html5Mode(true);
});

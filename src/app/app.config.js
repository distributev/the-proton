'use strict';

export function routeConfig($urlRouterProvider, $locationProvider) {
    'ngInject';

    $urlRouterProvider.when('', '/');
    $urlRouterProvider.otherwise('/');

    // $locationProvider.html5Mode(true);
}
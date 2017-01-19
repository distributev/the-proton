'use strict';

export default function routes($stateProvider) {
    'ngInject';

    $stateProvider.state('main', {
        url: '/',
        redirectTo: 'main.home',
        template: '<main></main>'
    });
}
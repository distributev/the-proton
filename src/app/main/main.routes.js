'use strict';

export default function routes($stateProvider) {
    'ngInject';

    $stateProvider.state('main', {
        url: '/',
        redirectTo: 'main.processing.doAction',
        template: '<main></main>'
    });
}
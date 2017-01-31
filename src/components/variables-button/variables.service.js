const VARIABLES = [{
    name: '{{built-in1}}',
    type: 'built-in'
}, {
    name: '{{built-in2}}',
    type: 'built-in'
}, {
    name: '{{built-in3}}',
    type: 'built-in'
}, {
    name: '{{custom1}}',
    type: 'custom'
}, {
    name: '{{custom2}}',
    type: 'custom'
}, {
    name: '{{custom3}}',
    type: 'custom'
}];
// TODO: replace static sample Variables
export class Variables {

    /*@ngInject*/
    constructor($http, $q) {
        this.$http = $http;
        this.$q = $q;
    }

    getVariables() {
        return this.$q.resolve(VARIABLES);
    }
}
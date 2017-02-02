import rx from 'rx-angular';

export class Breadcrumb {

    /*@ngInject*/
    constructor($http, $q) {
        this.$http = $http;
        this.$q = $q;
        this.currentState = {};
        this.subject = new rx.Subject();
    }

    getCurrentState() {
        return this.currentState;
    }

    setCurrentState(state) {
        this.currentState = state;
        this.subject.onNext(state);
    }

    subscribe(o) {
        return this.subject.subscribe(o);
    }
}
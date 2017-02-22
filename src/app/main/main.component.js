class MainController {

    /*@ngInject*/
    constructor($http, SkinService, $timeout) {
        this.$http = $http;
        this.skinService = SkinService;
        this.$timeout = $timeout;
    }

    $onInit() {
        this.activeSection = 'Process';
    }

    $onChanges(changes) {
        this.$timeout(() => {
            this.onLayoutChange();
        });
    }

    onLayoutChange() {
        $(function() {
            $.AdminLTE.layout.fix();
            $.AdminLTE.layout.activate();
            $.AdminLTE.controlSidebar.activate();
        });
    }

    changeSkin({ skin }) {
        this.skin = skin;
    }

    activeSectionChange({ section }) {
        this.activeSection = section;
    }
}

export const MainComponent = {
    bindings: {
        skin: '<'
    },
    template: require('./main.html'),
    controller: MainController
}
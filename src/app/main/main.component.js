class MainController {

    /*@ngInject*/
    constructor($http, SkinService) {
        this.$http = $http;
        this.skinService = SkinService;
    }

    $onInit() {
        this.skin = this.skinService.getSkin();
        this.activeSection = 'Process';
    }

    $onChanges(changes) {
        this.onLayoutChange();
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
    bindings: {},
    template: require('./main.html'),
    controller: MainController
}
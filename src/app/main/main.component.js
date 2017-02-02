class MainController {

    /*@ngInject*/
    constructor($http, SkinService) {
        this.$http = $http;
        this.skinService = SkinService;
    }

    $onInit() {
        this.skin = this.skinService.getSkin();
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
}

export const MainComponent = {
    bindings: {},
    template: require('./main.html'),
    controller: MainController
}
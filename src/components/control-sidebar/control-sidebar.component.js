export class ControlSidebarController {
    /*@ngInject*/
    constructor(SkinService) {
        this.skinService = SkinService;
    }

    $onInit() {

    }

    changeSkin(value) {
        let skins = this.skinService.getSkins();
        if (skins.indexOf(value) !== -1) {
            this.skinService.setSkin(value);
            this.onSkinChange({
                $event: {
                    skin: value
                }
            });
        }
    }
}

export const ControlSidebarComponent = {
    template: require('./control-sidebar.html'),
    bindings: {
        onSkinChange: '&'
    },
    controller: ControlSidebarController
};
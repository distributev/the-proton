import angular from 'angular';

export class ControlSidebarController {
    /*@ngInject*/
    constructor(SkinService) {
        this.message = 'World';
        this.skinService = SkinService;
    }

    $onInit() {

    }

    changeSkin(value) {
        let skins = this.skinService.getSkins();
        if (skins.indexOf(value) !== -1) {
            this.onSkinChange({
                $event: {
                    skin: value
                }
            });
        }
    }
}

export default angular.module('theProtonApp.control-sidebar', [])
    .component('controlSidebar', {
        template: require('./control-sidebar.html'),
        bindings: {
            message: '<',
            onSkinChange: '&'
        },
        controller: ControlSidebarController
    })
    .name;
import Config from 'electron-config';
const config = new Config({
    defaults: {
        skin: 'blue-light'
    },
    name: 'internal/config'
});

export class Skin {

    /*@ngInject*/
    constructor($http) {
        this.$http = $http;
    }

    getSkins() {
        return [
            'skin-blue',
            'skin-blue-light',
            'skin-yellow',
            'skin-yellow-light',
            'skin-green',
            'skin-green-light',
            'skin-purple',
            'skin-purple-light',
            'skin-red',
            'skin-red-light',
            'skin-black',
            'skin-black-light'
        ];
    }

    getSkin() {
        return 'skin-' + config.get('skin');
    }

    setSkin(skin) {
        config.set('skin', skin.replace('skin-', ''));
    }
}
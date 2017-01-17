export class Skin {

    /*@ngInject*/
    constructor($http) {
        this.$http = $http;
        this.skin = 'skin-blue-light';
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
        return this.skin;
    }

    setSkin(skin) {
        this.skin = skin;
    }
}
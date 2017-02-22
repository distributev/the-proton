export class Skin {

    /*@ngInject*/
    constructor($http, $q, ConfigService) {
        this.$http = $http;
        this.$q = $q;
        this.ConfigService = ConfigService;
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
        return this.$q((resolve, reject) => {
            this.ConfigService.get('skin').then(skin => {
                    resolve('skin-' + skin);
                })
                .catch(reject);
        });
    }

    setSkin(skin) {
        return this.ConfigService.set({ skin: skin.replace('skin-', '') });
    }
}
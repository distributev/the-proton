import _ from 'lodash';
import wellKnown from 'nodemailer-wellknown/services.json';

export class ConfigurationEmail {

    /*@ngInject*/
    constructor($http, $q) {
        this.$http = $http;
        this.$q = $q;
        this.wellKnown = _.mapValues(wellKnown, (value, key) => {
            value.name = key;
            return value;
        });
    }

    getDefaultWellKnownServices() {
        let defaultServices = [
            'Outlook365',
            'Gmail',
            'Mandrill',
            'SendGrid',
            'Mailgun'
        ];
        return this.$q.resolve(_.at(this.wellKnown, defaultServices));
    }

    getAllWellKnownServices() {
        return this.$q.resolve(this.wellKnown);
    }

    getCloudProviders() {
        return [{
                name: "Office 365",
                logo: "assets/images/office365.png",
                description: `
                    Anim laborum non amet consectetur minim magna fugiat labore.

                    Exercitation non anim eu aute mollit. Irure laboris esse mollit ipsum eiusmod sunt. Mollit proident quis voluptate occaecat. Eiusmod ipsum cupidatat Lorem nisi aliquip veniam.
                    
                    Deserunt eiusmod enim non proident.`
            },
            {
                name: "Google Apps",
                logo: "assets/images/gapps.png",
                description: `
                    Anim laborum non amet consectetur minim magna fugiat labore.

                    Exercitation non anim eu aute mollit. Irure laboris esse mollit ipsum eiusmod sunt. Mollit proident quis voluptate occaecat. Eiusmod ipsum cupidatat Lorem nisi aliquip veniam.
                    
                    Deserunt eiusmod enim non proident.`
            },
            // {
            //     name: "Microsoft Exchange",
            //     logo: "assets/images/exchange32.png",
            //     description: `
            //         Anim laborum non amet consectetur minim magna fugiat labore.

            //         Exercitation non anim eu aute mollit. Irure laboris esse mollit ipsum eiusmod sunt. Mollit proident quis voluptate occaecat. Eiusmod ipsum cupidatat Lorem nisi aliquip veniam.

            //         Deserunt eiusmod enim non proident.`
            // },
            {
                name: "Mailgun",
                logo: "assets/images/mailgun32.png",
                description: `
                    Anim laborum non amet consectetur minim magna fugiat labore.

                    Exercitation non anim eu aute mollit. Irure laboris esse mollit ipsum eiusmod sunt. Mollit proident quis voluptate occaecat. Eiusmod ipsum cupidatat Lorem nisi aliquip veniam.
                    
                    Deserunt eiusmod enim non proident.`
            },
            {
                name: "Mandrill",
                logo: "assets/images/mandrill32.png",
                description: `
                    Anim laborum non amet consectetur minim magna fugiat labore.

                    Exercitation non anim eu aute mollit. Irure laboris esse mollit ipsum eiusmod sunt. Mollit proident quis voluptate occaecat. Eiusmod ipsum cupidatat Lorem nisi aliquip veniam.
                    
                    Deserunt eiusmod enim non proident.`
            },
            {
                name: "SendGrid",
                logo: "assets/images/sendgrid32.png",
                description: `
                    Anim laborum non amet consectetur minim magna fugiat labore.

                    Exercitation non anim eu aute mollit. Irure laboris esse mollit ipsum eiusmod sunt. Mollit proident quis voluptate occaecat. Eiusmod ipsum cupidatat Lorem nisi aliquip veniam.
                    
                    Deserunt eiusmod enim non proident.`
            }
        ];
    }

    getSkin() {
        return 'skin-' + config.get('skin');
    }

    setSkin(skin) {
        config.set('skin', skin.replace('skin-', ''));
    }
}
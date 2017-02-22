import fs from 'fs-extra';
import path from 'path';

export class Config {

    /*@ngInject*/
    constructor($http, $q, configPath, templatesPath) {
        this.$http = $http;
        this.$q = $q;
        this.configPath = configPath;
        this.templatesPath = templatesPath;
        this.getConfig().then(config => {
            this.config = config;
        });
    }

    initConfig() {
        return this.$q((resolve, reject) => {
            fs.readJson(path.join(__dirname, this.templatesPath, 'config/internal/config.json'), (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    this.set(data).then(() => resolve());
                }
            });
        });
    }

    getConfig() {
        return this.$q((resolve, reject) => {
            fs.readJson(path.join(__dirname, this.configPath), (err, data) => {
                if (err) {
                    if (err.message.indexOf('ENOENT') !== -1) {
                        this.initConfig().then(() => {
                                return this.getConfig();
                            })
                            .then(resolve)
                            .catch(reject);
                    } else reject(err);
                } else resolve(data);
            });
        });
    }

    get(key) {
        return this.$q((resolve, reject) => {
            this.getConfig().then(config => {
                    this.config = config;
                    resolve(this.config[key]);
                })
                .catch(reject);
        });
    }

    set(object) {
        return this.$q((resolve, reject) => {
            this.config = Object.assign({}, this.config, object);
            fs.outputJson(path.join(__dirname, this.configPath), this.config, err => {
                if (err) reject(err);
                else resolve();
            });
        });
    }
}
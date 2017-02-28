import _ from 'lodash';
import Promise from 'bluebird';
import fsExtra from 'fs-extra';
const fs = Promise.promisifyAll(fsExtra);
import path from 'path';
import xml from 'xml2js';

export class ConfigurationTemplates {

    /*@ngInject*/
    constructor($http, $q, configPath, templatesPath, defaultTemplateFile) {
        this.$http = $http;
        this.$q = $q;
        this.configPath = configPath;
        this.templatesPath = templatesPath;
        this.defaultTemplateFile = defaultTemplateFile;
    }

    initDefault() {
        return fs.readFileAsync(path.join(__dirname, this.templatesPath, this.defaultTemplateFile))
            .then(data => {
                let promises = [];
                let src = path.join(__dirname, this.templatesPath, 'config');
                let dest = path.join(__dirname, this.configPath, 'config');
                promises.push(fs.copyAsync(src, dest, {
                    override: false,
                    filter: srcPath => {
                        let filename = srcPath.substr(src.length);
                        return filename === '' || path.extname(filename) === '.xml';
                    }
                }));
                promises.push(fs.copyAsync(path.join(src, 'default/settings.xml'), path.join(dest, 'default/settings.xml'), { override: false }));
                return this.$q.all(promises);
            });
    }

    getDefault() {
        return fs.readFileAsync(path.join(__dirname, this.configPath, this.defaultTemplateFile))
            .then(data => {
                return this.parseXml(data);
            })
            .catch(err => {
                if (err.message.indexOf('ENOENT') !== -1) {
                    return this.initDefault()
                        .then(() => this.getDefault());
                } else return this.$q.reject(err);
            });
    }

    getTemplates() {
        return this.getXmlFiles(path.join(__dirname, this.configPath, 'config/'))
            .then(templates => {
                let index = _.findIndex(templates, template => {
                    return template.theproton.settings.filename === 'settings.xml';
                });
                templates.splice(0, 0, templates.splice(index, 1)[0]);
                return this.$q.resolve(templates);
            });
    }

    setTemplates(templates) {
        let promises = [];
        templates.forEach(tpl => promises.push(this.setTemplate(tpl)));
        return this.$q.all(promises);
    }

    getTemplate(filePath) {
        return fs.readFileAsync(filePath)
            .then(data => this.parseXml(data));
    }

    setTemplate(data) {
        let filename = data.theproton.settings.filename;
        let template = {};
        return this.getTemplates()
            .then(templates => {
                template = _.find(templates, { 'theproton.settings.filename': filename });
                if (template) {
                    template = Object.assign({}, template, data);
                } else {
                    template = data;
                }
                return this.buildXml(template);
            })
            .then(xmlData => {
                return fs.outputFileAsync(path.join(__dirname, this.configPath, 'config', filename), xmlData);
            });
    }

    getXmlFiles(filePath) {
        return fs.readdirAsync(filePath)
            .then(files => {
                let promises = [];
                files.forEach(filename => {
                    if (path.extname(filename) === '.xml') {
                        let src = path.join(filePath, filename);
                        promises.push(
                            fs.readFileAsync(src).then(data => this.parseXml(data))
                        );
                    }
                });
                return this.$q.all(promises);
            });
    }

    parseXml(data) {
        return this.$q((resolve, reject) => {
            xml.parseString(data, { trim: true, explicitArray: false }, (err, result) => {
                if (err) reject(err);
                else {
                    resolve(result);
                }
            });
        });
    }

    buildXml(data) {
        return this.$q((resolve, reject) => {
            const builder = new xml.Builder();
            try {
                let result = builder.buildObject(data);
                resolve(result);
            } catch (err) {
                reject(err);
            }
        });
    }
}
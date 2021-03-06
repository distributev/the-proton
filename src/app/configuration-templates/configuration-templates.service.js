import _ from 'lodash';
import Promise from 'bluebird';
import fsExtra from 'fs-extra';
const fs = Promise.promisifyAll(fsExtra);
import path from 'path';
import xml from 'xml2js';
import rx from 'rx-angular';

export class ConfigurationTemplates {

    /*@ngInject*/
    constructor($http, $q, configPath, templatesPath, defaultTemplateFile) {
        this.$http = $http;
        this.$q = $q;
        this.subject = new rx.Subject();
        this.changesSubject = new rx.Subject();
        this.resetSubject = new rx.Subject();
        this.configPath = configPath;
        this.templatesPath = templatesPath;
        this.defaultTemplateFile = defaultTemplateFile;
        this.getSavedTemplate()
            .then(template => this.savedTemplate = template);
    }

    getCurrentTemplate() {
        if (!this.currentTemplate) {
            return this.getDefault();
        }
        return this.$q.resolve(this.currentTemplate);
    }

    setCurrentTemplate(data, notify) {
        let filePath = data.path;
        let template = {};
        return this.getTemplates()
            .then(templates => {
                template = _.find(templates, { 'path': filePath });
                if (template) {
                    template = Object.assign({}, template, data);
                } else {
                    template = data;
                }
                this.currentTemplate = template;
                if (notify) this.subject.onNext(this.currentTemplate);
                this.checkForChanges()
                    .then(changes => {
                        this.changesSubject.onNext(changes);
                        return this.$q.resolve(this.currentTemplate);
                    });
            });
    }

    resetCurrentTemplate() {
        let template;
        return this.getCurrentTemplate()
            .then(currentTemplate => {
                template = currentTemplate;
                return this.getTemplates();
            })
            .then(templates => {
                template = _.find(templates, { 'path': template.path });
                this.checkForChanges()
                    .then(changes => {
                        this.changesSubject.onNext(changes);
                        this.resetSubject.onNext(template);
                        return this.setCurrentTemplate(template);
                    });
            });
    }

    checkForChanges() {
        return this.getSavedTemplate()
            .then(savedTemplate => {
                if (!angular.equals(this.currentTemplate, savedTemplate)) {
                    return this.$q.resolve(true);
                } else {
                    return this.$q.resolve(false);
                }
            });
    }

    getSavedTemplate() {
        return this.getCurrentTemplate()
            .then(currentTemplate => this.getTemplate(currentTemplate.path));

    }

    subscribe(template) {
        return this.subject.subscribe(template);
    }

    subscribeToChanges(template) {
        return this.changesSubject.subscribe(template);
    }

    subscribeToReset(template) {
        return this.resetSubject.subscribe(template);
    }

    initDefault() {
        return fs.readFileAsync(path.join(__dirname, this.templatesPath, this.defaultTemplateFile))
            .then(() => {
                let promises = [];
                let src = path.join(__dirname, this.templatesPath, 'config');
                let dest = path.join(__dirname, this.configPath, 'config');
                let tplSrc = path.join(__dirname, this.templatesPath, 'templates');
                let tplDest = path.join(__dirname, this.configPath, 'templates');
                promises.push(fs.copyAsync(src, dest, {
                    override: false,
                    filter: srcPath => {
                        let filename = srcPath.substr(src.length);
                        return filename === '' || path.extname(filename) === '.xml';
                    }
                }));
                promises.push(fs.copyAsync(path.join(src, 'default/settings.xml'), path.join(dest, 'default/settings.xml'), { override: false }));
                promises.push(fs.copyAsync(tplSrc, tplDest, { override: false }));
                return this.$q.all(promises);
            });
    }

    getDefault() {
        return fs.readFileAsync(path.join(__dirname, this.configPath, this.defaultTemplateFile))
            .then(data => {
                return this.parseXml(data, this.defaultTemplateFile);
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
                    return path.basename(template.path) === 'settings.xml';
                });
                templates.splice(0, 0, templates.splice(index, 1)[0]);
                return this.$q.resolve(templates);
            });
    }

    setTemplates(templates) {
        let promises = [];
        return this.getTemplates()
            .then(tpls => {
                tpls.forEach(tpl => {
                    if (!_.find(templates, { path: tpl.path })) {
                        promises.push(this.deleteTemplate(tpl));
                    }
                });
                templates.forEach(template => promises.push(this.setTemplate(template)));
                return this.$q.all(promises);
            });
    }

    getTemplate(filePath) {
        return fs.readFileAsync(filePath)
            .then(data => this.parseXml(data, filePath));
    }

    setTemplate(data) {
        data = data || this.currentTemplate;
        let filePath = data.path;
        let template = {};
        return this.getTemplates()
            .then(templates => {
                template = _.find(templates, { 'path': filePath });
                if (template) {
                    template = Object.assign({}, template, data);
                } else {
                    template = data;
                }
                return this.buildXml(template);
            })
            .then(xmlData => {
                return fs.outputFileAsync(path.join(__dirname, this.configPath, filePath), xmlData);
            })
            .then(() => this.setCurrentTemplate(template));
    }

    deleteTemplate(template) {
        return fs.unlinkAsync(path.join(__dirname, this.configPath, template.path));
    }

    getXmlFiles(filePath) {
        return fs.readdirAsync(filePath)
            .then(files => {
                let promises = [];
                files.forEach(filename => {
                    if (path.extname(filename) === '.xml') {
                        let src = path.join(filePath, filename);
                        promises.push(
                            fs.readFileAsync(src).then(data => this.parseXml(data, src))
                        );
                    }
                });
                return this.$q.all(promises);
            });
    }

    parseXml(data, filePath) {
        return this.$q((resolve, reject) => {
            xml.parseString(data, { trim: true, explicitArray: false }, (err, result) => {
                if (err) reject(err);
                else {

                    if (result.theproton.settings.attachments.items && result.theproton.settings.attachments.items.attachment && !_.isArray(result.theproton.settings.attachments.items.attachment)) {
                        result.theproton.settings.attachments.items.attachment = [result.theproton.settings.attachments.items.attachment];
                    }
                    resolve({
                        path: ('./' + path.relative(path.join(__dirname, this.configPath), filePath)) || '',
                        name: result.theproton.settings.template || '',
                        fileName: result.theproton.settings.filename || '',
                        outputFolder: result.theproton.settings.outputfolder || '',
                        quarantineDocuments: result.theproton.settings.quarantinefiles === 'true' ? true : false,
                        quarantineFolder: result.theproton.settings.quarantinefolder || '',
                        sendDocuments: result.theproton.settings.sendfiles === 'true' ? true : false,
                        deleteDocuments: result.theproton.settings.deletefiles === 'true' ? true : false,
                        htmlEmail: result.theproton.settings.htmlemail === 'true' ? true : false,
                        emailServer: {
                            host: result.theproton.settings.emailserver.host || '',
                            port: result.theproton.settings.emailserver.port || '',
                            userId: result.theproton.settings.emailserver.userid || '',
                            userPassword: result.theproton.settings.emailserver.userpassword || '',
                            useSsl: result.theproton.settings.emailserver.usessl === 'true' ? true : false,
                            useTls: result.theproton.settings.emailserver.usetls === 'true' ? true : false,
                            debug: result.theproton.settings.emailserver.debug === 'true' ? true : false,
                            fromEmailAddress: result.theproton.settings.emailserver.fromaddress || '',
                            fromName: result.theproton.settings.emailserver.name || ''
                        },
                        emailSettings: {
                            to: result.theproton.settings.emailsettings.to || '',
                            cc: result.theproton.settings.emailsettings.cc || '',
                            bcc: result.theproton.settings.emailsettings.bcc || '',
                            subject: result.theproton.settings.emailsettings.subject || '',
                            text: result.theproton.settings.emailsettings.text || '',
                            html: result.theproton.settings.emailsettings.html || ''
                        },
                        attachments: {
                            items: result.theproton.settings.attachments.items || [],
                            archive: {
                                archiveAttachments: result.theproton.settings.attachments.archive.archiveattachments === 'true' ? true : false,
                                archiveFilename: result.theproton.settings.attachments.archive.archivefilename || ''
                            }
                        },
                        uploadSettings: {
                            ftpCommand: result.theproton.settings.ftpcommand || '',
                            sftpCommand: result.theproton.settings.sftpcommand || ''
                        },
                        failJobIfAnyDistributionFails: result.theproton.settings.failjobifanydistributionfails === 'true' ? 'true' : 'false',
                    });
                }
            });
        });
    }

    buildXml(data) {
        return this.$q((resolve, reject) => {
            const builder = new xml.Builder();
            try {
                let result = builder.buildObject({
                    theproton: {
                        settings: {
                            template: data.name || '',
                            filename: data.fileName || '',
                            outputfolder: data.outputFolder || '',
                            quarantinefiles: data.quarantineDocuments ? 'true' : 'false',
                            quarantinefolder: data.quarantineFolder || '',
                            sendfiles: data.sendDocuments ? 'true' : 'false',
                            deletefiles: data.deleteDocuments ? 'true' : 'false',
                            htmlemail: data.htmlEmail ? 'true' : 'false',
                            emailserver: {
                                host: data.emailServer.host || '',
                                port: data.emailServer.port || '',
                                userid: data.emailServer.userId || '',
                                userpassword: data.emailServer.userPassword || '',
                                usessl: data.emailServer.useSsl ? 'true' : 'false',
                                usetls: data.emailServer.useTls ? 'true' : 'false',
                                debug: data.emailServer.debug ? 'true' : 'false',
                                fromaddress: data.emailServer.fromEmailAddress || '',
                                name: data.emailServer.fromName || ''
                            },
                            emailsettings: {
                                to: data.emailSettings.to || '',
                                cc: data.emailSettings.cc || '',
                                bcc: data.emailSettings.bcc || '',
                                subject: data.emailSettings.subject || '',
                                text: data.emailSettings.text || '',
                                html: data.emailSettings.html || ''
                            },
                            attachments: {
                                items: data.attachments.items || '',
                                archive: {
                                    archiveattachments: data.attachments.archive.archiveAttachments ? 'true' : 'false',
                                    archivefilename: data.attachments.archive.archiveFilename || ''
                                }
                            },
                            uploadsettings: {
                                ftpcommand: data.uploadSettings.ftpCommand || '',
                                sftpcommand: data.uploadSettings.sftpCommand || ''
                            },
                            failjobifanydistributionfails: data.failJobIfAnyDistributionFails || 'false',
                        }
                    }
                });
                resolve(result);
            } catch (err) {
                reject(err);
            }
        });
    }

    getFile(filePath) {
        return fs.readFileAsync(filePath, 'utf8');
    }

    saveFile(filePath, data) {
        return fs.outputFileAsync(filePath, data);
    }
}

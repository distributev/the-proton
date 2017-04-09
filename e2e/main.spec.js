import Main from './main.po';
import ConfigurationTemplates from './components/configuration-templates.po';
import ConfigurationGeneral from './components/configuration-general.po';
import FeedbackModal from './components/feedback-modal.po';

describe('Main View', function () {
    this.slow(120000);
    let main;
    let feedbackModal;

    beforeEach(function () {
        main = new Main();
    });

    afterEach(function () {

    });

    it('should include Navbar with correct title', function () {
        expect(main.navbar.isVisible()).to.eventually.equal(true);
        expect(main.navbar.getTitle()).to.eventually.equal('TheProtonApp');
    });

    it('should default to "Process" section', function () {
        expect(main.navbar.sectionBtn.getText()).to.eventually.equal('Process')
    });

    it('should default to "Do Action" View', function () {
        expect(main.getCurrentView()).to.eventually.equal('Processing Do Action')
    });

    describe('Configuration Templates View', function () {
        let configurationTemplates;

        beforeEach(function () {
            configurationTemplates = new ConfigurationTemplates();
            return main.navbar.goToConfigurationTemplatesSection();
        });

        it('should be on the "Configuration Templates" section', function () {
            expect(main.navbar.sectionBtn.getText()).to.eventually.equal('Configuration Templates')
        });

        it('should create a new template successfully', function () {
            configurationTemplates.add({ name: 'Statements'});
            configurationTemplates.save();
            feedbackModal = new FeedbackModal();
            expect(feedbackModal.getMessageText()).to.eventually.contain('Configuration Templates saved!');
            feedbackModal.dismiss();
        });

        it('should add new template "Statements" to templates list', function () {
            expect(configurationTemplates.findTemplateInList('Statements').count()).to.eventually.equal(1);
        });

    });

    describe('Configuration View', function () {
        let configurationGeneral;
        const defaultTplName = 'My Default Config Template';
        const defaultConfigData = {
            fileName: "default.txt",
            outputFolder: "./default/output/",
            quarantineFolder: "./default/quarantine/",
            sendDocuments: true,
            deleteDocuments: true,
            quarantineDocuments: true
        }
        const anotherNewTplName = 'Statements';
        const anotherNewConfigData = {
            fileName: "statement.txt",
            outputFolder: "./statement/output/",
            quarantineFolder: "./statement/quarantine/",
            sendDocuments: true,
            deleteDocuments: true,
            quarantineDocuments: true
        }

        beforeEach(function () {
            configurationGeneral = new ConfigurationGeneral();
            return main.navbar.goToConfigureSection();
        });

        it('should be on the "Configure" section', function () {
            expect(main.navbar.sectionBtn.getText()).to.eventually.equal('Configure')
        });

        it('should default to "Configuration General" View', function () {
            expect(main.getCurrentView()).to.eventually.equal('Configuration General')
        });

        it('should show the Current Config Template button', function () {
            expect(main.mainSidebar.isVisible()).to.eventually.equal(true);
        });

        it('should load "My Default Config Template" by default', function () {
            expect(main.mainSidebar.currentTemplateBtn.getText()).to.eventually.equal(defaultTplName);
        });

        describe('Default Config Template', function () {
            beforeEach(function () {
                return main.mainSidebar.switchToTemplate(defaultTplName);
            });

            it('should load "My Default Config Template"', function () {
                feedbackModal = new FeedbackModal();
                expect(feedbackModal.getMessageText()).to.eventually.contain(defaultTplName);
                feedbackModal.dismiss();
                expect(main.mainSidebar.currentTemplateBtn.getText()).to.eventually.equal(defaultTplName);
            });

            it('should modify/save configuration template data', function () {
                feedbackModal = new FeedbackModal();
                feedbackModal.dismiss();
                configurationGeneral.save(defaultConfigData);
                expect(configurationGeneral.getFeedbackText()).to.eventually.equal('Configuration settings saved!');
                feedbackModal = new FeedbackModal();
                feedbackModal.dismiss();
            });
        });

        describe('Another New Config Template', function () {
            beforeEach(function () {
                return main.mainSidebar.switchToTemplate(anotherNewTplName);
            });

            it('should load "Statements"', function () {
                feedbackModal = new FeedbackModal();
                expect(feedbackModal.getMessageText()).to.eventually.contain(anotherNewTplName);
                feedbackModal.dismiss();
                expect(main.mainSidebar.currentTemplateBtn.getText()).to.eventually.equal(anotherNewTplName);
            });

            it('should modify/save configuration template data', function () {
                feedbackModal = new FeedbackModal();
                feedbackModal.dismiss();
                configurationGeneral.save(anotherNewConfigData);
                feedbackModal = new FeedbackModal();
                expect(feedbackModal.getMessageText()).to.eventually.equal('Configuration settings saved!');
                feedbackModal.dismiss();
            });
        });
    });
});

const EC = protractor.ExpectedConditions;

import FeedbackModal from './feedback-modal.po';

class MainSidebar {
    constructor(hostElement) {
        this._containerElement = hostElement.element(by.css('main-sidebar'));
        this.currentTemplateBtn = this._containerElement.element(by.binding('$ctrl.currentTemplate.name'));
    }

    isVisible() {
        return this._containerElement.isPresent();
    }

    switchToTemplate(template) {
        this.currentTemplateBtn.click();
        const currentTemplate = element(by.css('.select-current-template li a'));
        browser.wait(EC.presenceOf(currentTemplate), 5000);
        let configTemplates = element.all(by.css('.select-current-template li a'));
        return configTemplates.filter(function(elem) {
            return elem.getText().then(function(text) {
                return text === template;
            });
        }).first().click();
    }
}

export default MainSidebar;

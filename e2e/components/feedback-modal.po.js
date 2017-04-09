const EC = protractor.ExpectedConditions;

class FeedbackModal {
    constructor() {
        browser.wait(EC.presenceOf(element(by.css('feedback-modal'))), 5000);
        this._containerElement = element(by.css('feedback-modal'));
        this.message = this._containerElement.element(by.binding('$ctrl.resolve.message'));
        this.okBtn = this._containerElement.element(by.css('.modal-footer .btn-primary'));
    }

    getMessageText() {
        return this.message.getText();
    }

    dismiss() {
        return this.okBtn.click();
    }
}

export default FeedbackModal;

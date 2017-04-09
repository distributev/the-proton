const EC = protractor.ExpectedConditions;

class EditTemplateModal {
    constructor() {
        browser.wait(EC.presenceOf(element(by.css('edit-template-modal'))), 5000);
        this._containerElement = element(by.css('edit-template-modal'));
        this.form = this._containerElement.element(by.css('form'));
        this.form.name = this.form.element(by.model('$ctrl.resolve.template.name'));
        this.form.submit = this.form.element(by.css('button[type="submit"]'));
    }

    save(data) {
        this.form.name.clear();
        this.form.name.sendKeys(data.name);
        return this.form.submit.click();
    }
}

export default EditTemplateModal;

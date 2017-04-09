const EC = protractor.ExpectedConditions;

class Navbar {
    constructor(hostElement) {
        this._containerElement = hostElement.element(by.css('navbar'));
        this.sectionBtn = this._containerElement.element(by.binding('$ctrl.activeSection'));
        this.navbarBrand = this._containerElement.element(by.css('.navbar-brand'));
    }

    isVisible() {
        return this._containerElement.isPresent();
    }

    getTitle() {
        return this.navbarBrand.getText();
    }

    goToSection(index) {
        this.sectionBtn.click();
        const section = element(by.css('.select-section-options li a'));
        browser.wait(EC.presenceOf(section), 5000);
        return element.all(by.css('.select-section-options li a')).get(index).click();
    }

    goToProcessSection() {
        return this.goToSection(0);
    }

    goToConfigureSection() {
        return this.goToSection(1);
    }

    goToConfigurationTemplatesSection() {
        return this.goToSection(2);
    }
}

export default Navbar;

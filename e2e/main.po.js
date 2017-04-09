import Navbar from './components/navbar.po';
import Breadcrumb from './components/breadcrumb.po';
import MainSidebar from './components/main-sidebar.po';
const EC = protractor.ExpectedConditions;

class Main {
    constructor() {
        browser.wait(EC.presenceOf(element(by.css('main'))), 60000);
        this._containerElement = element(by.css('main'));
        this.navbar = new Navbar(this._containerElement);
        this.breadcrumb = new Breadcrumb(this._containerElement);
        this.mainSidebar = new MainSidebar(this._containerElement);
    }

    getCurrentView() {
        return this.breadcrumb.getCurrentView();
    }
}

export default Main;

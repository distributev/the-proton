class BreadcrumbComponent {
    constructor(hostElement) {
        this._containerElement = hostElement.element(by.css('breadcrumb'));
    }

    getCurrentView() {
        return this._containerElement.getText();
    }
}

export default BreadcrumbComponent;

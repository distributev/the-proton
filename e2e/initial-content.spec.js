describe('Main View', function () {
    this.slow(120000);
    let page;

    beforeEach(function () {
        page = {
            navbarTitle: element(by.css('.navbar-brand'))
        };
    });

    afterEach(function () {

    });

    it('should include Navbar with correct title', function () {
        expect(page.navbarTitle.getText()).to.eventually.equal('TheProtonApp');
    });
});

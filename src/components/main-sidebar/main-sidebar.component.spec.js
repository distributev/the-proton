'use strict';

describe('Component: mainSidebar', function() {
    // load the component's module
    beforeEach(module('theProtonApp.main-sidebar'));

    var mainSidebarController;

    // Initialize the component and a mock scope
    beforeEach(inject(function($componentController) {
        mainSidebarController = $componentController('mainSidebar', {});
    }));

    it('should ...', function() {
        expect(1).to.equal(1);
    });
});
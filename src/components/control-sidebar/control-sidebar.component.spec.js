'use strict';

describe('Component: controlSidebar', function() {
    // load the component's module
    beforeEach(module('theProton.control-sidebar'));

    var controlSidebarController;

    // Initialize the component and a mock scope
    beforeEach(inject(function($componentController) {
        controlSidebarController = $componentController('controlSidebar', {});
    }));

    it('should ...', function() {
        expect(1).to.equal(1);
    });
});
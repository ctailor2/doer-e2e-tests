describe('unlock timeout', () => {
    beforeEach(() => {
        cy.visit('/signup');
        let msSinceEpoch = Date.now();
        cy.contains('.form-group', 'Email')
            .find('input')
            .type('e2euser' + msSinceEpoch + '@e2etest.com');
        cy.contains('.form-group', 'Password')
            .find('input')
            .type('e2epassword');
        cy.contains('.form-group', 'Password Confirmation')
            .find('input')
            .type('e2epassword');
        cy.contains('button', 'Submit').click();
        cy.wait(2000);
    });

    it('hides the hidden list after its unlock period expires', () => {
        cy.get('input[type="text"]').type('invisible task');
        cy.contains('button', 'Do!').click();
        cy.contains('button', 'Later').click();
        cy.wait(1000);

        cy.get('.tab-pane.active').within(() => {
            cy.get('span.list-group-item').should('not.contain', 'invisible task');
        });

        cy.get('.nav-tabs').contains('a', 'Later').click();
        cy.get('.modal').contains('button', 'Unlock').click();
        cy.wait(1000);
        cy.get('.nav-tabs').contains('a', 'Later').click();
        cy.wait(1000);

        cy.get('.tab-pane.active').within(() => {
            cy.get('span.list-group-item').should('contain', 'invisible task');
        });

        cy.clock();
        cy.wait(1000);
        cy.tick(1801000)

        cy.get('.tab-pane.active').within(() => {
            cy.get('span.list-group-item').should('not.contain', 'invisible task');
        });
    });

    afterEach(() => {
        cy.get('nav .dropdown').contains('a', 'Menu').click();
        cy.get('nav .dropdown').contains('a', 'Logout').click();
    });
});
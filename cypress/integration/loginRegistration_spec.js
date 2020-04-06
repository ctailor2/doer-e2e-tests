describe('loginRegistration', () => {
    beforeEach(() => {
        cy.visit('');
    });

    it('lands the user on the login page', () => {
        cy.location().should((location) => {
            expect(location.pathname).to.eq('/login');
        });
    });

    it('allows navigating between login and signup pages', () => {
        cy.contains('a', 'Sign up').click();
        cy.wait(1000);

        cy.location().should((location) => {
            expect(location.pathname).to.eq('/signup');
        });

        cy.contains('a', 'Login').click();
        cy.wait(1000);

        cy.location().should((location) => {
            expect(location.pathname).to.eq('/login');
        });
    });

    it('lands the user on the home page upon login', () => {
        cy.contains('label', 'Email')
            .closest('.form-group')
            .find('input')
            .type('basicTodoManagement@e2etest.com');
        cy.contains('label', 'Password')
            .closest('.form-group')
            .find('input')
            .type('e2epassword');
        cy.contains('button', 'Submit').click();
        cy.wait(2000);

        cy.contains('button', 'Do!').should('be.visible');
    });

    it('lands the user on the home page upon signup', () => {
        cy.contains('a', 'Sign up').click();
        cy.wait(1000);

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

        cy.contains('button', 'Do!').should('be.visible');
    });
});

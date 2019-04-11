describe('basic todo management', () => {
    beforeEach(() => {
        cy.visit('/login');
        cy.contains('.form-group', 'Email')
            .find('input')
            .type('basicTodoManagement@e2etest.com');
        cy.contains('.form-group', 'Password')
            .find('input')
            .type('e2epassword');
        cy.contains('button', 'Submit').click();
        cy.wait(2000);
    });

    it('includes adding, editing, and deleting todos', () => {
        cy.get('input[type="text"]').type('added task');
        cy.contains('button', 'Do!').click();
        cy.contains('button', 'Now').click();
        cy.wait(1000);

        cy.get('.tab-pane.active').within(() => {
            cy.get('span.list-group-item').should('have.length', 1);
            cy.get('span.list-group-item').should('contain', 'added task');
        });

        cy.get('span.list-group-item').find('button').click();
        cy.get('span.list-group-item').find('input').type(' was edited');
        cy.get('span.list-group-item').contains('button', 'Save').click();
        cy.wait(1000);
        cy.get('span.list-group-item').should('contain', 'added task was edited');

        cy.get('span.list-group-item').find('a .glyphicon-remove').click();
        cy.wait(1000);

        cy.get('.tab-pane.active').within(() => {
            cy.get('span.list-group-item').should('have.length', 0);
        });
    });

    it('includes pulling todos from the hidden list', () => {
        cy.get('input[type="text"]').type('visible task');
        cy.contains('button', 'Do!').click();
        cy.contains('button', 'Now').click();
        cy.wait(1000);

        cy.get('.tab-pane.active').within(() => {
            cy.get('span.list-group-item').should('have.length', 1);
            cy.get('span.list-group-item').should('contain', 'visible task');
        });

        cy.get('input[type="text"]').type('invisible task');
        cy.contains('button', 'Do!').click();
        cy.contains('button', 'Later').click();
        cy.wait(1000);

        cy.get('.tab-pane.active').within(() => {
            cy.get('span.list-group-item').should('not.contain', 'invisible task');
        });

        cy.contains('button', 'Replenish').click();
        cy.wait(1000);

        cy.get('.tab-pane.active').within(() => {
            cy.get('span.list-group-item').should('have.length', 2);
            cy.get('span.list-group-item').should('contain', 'invisible task');
        });

        cy.contains('visible task').closest('span.list-group-item').find('a .glyphicon-remove').click();
        cy.wait(1000);
        cy.contains('invisible task').closest('span.list-group-item').find('a .glyphicon-remove').click();
    });

    it('includes completing todos and viewing them from the history page', () => {
        let currentTimestamp = new Date().toLocaleString();
        let taskWithTimestamp = 'task with timestamp ' + currentTimestamp
        cy.get('input[type="text"]').type(taskWithTimestamp);
        cy.contains('button', 'Do!').click();
        cy.contains('button', 'Now').click();
        cy.wait(1000);

        cy.get('.tab-pane.active').within(() => {
            cy.get('span.list-group-item').should('have.length', 1);
            cy.get('span.list-group-item').should('contain', taskWithTimestamp);
        });

        cy.get('span.list-group-item').find('input[type="checkbox"]').check();
        cy.wait(1000);

        cy.get('.tab-pane.active').within(() => {
            cy.get('span.list-group-item').should('have.length', 0);
        });

        cy.get('nav .dropdown').contains('a', 'Menu').click();
        cy.get('nav .dropdown').contains('a', 'History').click();
        cy.wait(1000);

        cy.get('.list-group-item').should('contain', taskWithTimestamp);
    });

    afterEach(() => {
        cy.get('nav .dropdown').contains('a', 'Menu').click();
        cy.get('nav .dropdown').contains('a', 'Logout').click();
    });
});
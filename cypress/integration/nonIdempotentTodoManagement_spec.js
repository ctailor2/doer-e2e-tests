describe('non idempotent todo management', () => {
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

    it('includes unlocking the hidden list to view hidden todos', () => {
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
    });

    it('includes pushing todos to the hidden list when the viewable list is full', () => {
        cy.get('input[type="text"]').type('first invisible task');
        cy.contains('button', 'Do!').click();
        cy.contains('button', 'Later').click();
        cy.wait(1000);
        cy.get('input[type="text"]').type('task to be pushed');
        cy.contains('button', 'Do!').click();
        cy.contains('button', 'Now').click();
        cy.wait(1000);
        cy.get('input[type="text"]').type('second visible task');
        cy.contains('button', 'Do!').click();
        cy.contains('button', 'Now').click();
        cy.wait(1000);

        cy.get('.tab-pane.active').within(() => {
            cy.get('span.list-group-item').should('have.length', 2);
            cy.get('span.list-group-item').eq(0).should('contain', 'second visible task');
            cy.get('span.list-group-item').eq(1).should('contain', 'task to be pushed');
        });

        cy.get('input[type="text"]').type('first visible task');
        cy.contains('button', 'Do!').click();
        cy.contains('button', 'Now').click();
        cy.wait(1000);

        cy.get('.tab-pane.active').within(() => {
            cy.get('span.list-group-item').should('have.length', 2);
            cy.get('span.list-group-item').eq(0).should('contain', 'first visible task');
            cy.get('span.list-group-item').eq(1).should('contain', 'second visible task');
        });

        cy.get('.nav-tabs').contains('a', 'Later').click();
        cy.get('.modal').contains('button', 'Unlock').click();
        cy.wait(1000);
        cy.get('.nav-tabs').contains('a', 'Later').click();
        cy.wait(1000);

        cy.get('.tab-pane.active').within(() => {
            cy.get('span.list-group-item').should('have.length', 2);
            cy.get('span.list-group-item').eq(0).should('contain', 'task to be pushed');
            cy.get('span.list-group-item').eq(1).should('contain', 'first invisible task');
        });
    });

    it('includes swapping the first todo from the hidden list with the last todo from the viewable list', () => {
        cy.get('input[type="text"]').type('first invisible task');
        cy.contains('button', 'Do!').click();
        cy.contains('button', 'Later').click();
        cy.wait(1000);
        cy.get('input[type="text"]').type('task to be swapped');
        cy.contains('button', 'Do!').click();
        cy.contains('button', 'Now').click();
        cy.wait(1000);
        cy.get('input[type="text"]').type('second visible task');
        cy.contains('button', 'Do!').click();
        cy.contains('button', 'Now').click();
        cy.wait(1000);

        cy.get('.tab-pane.active').within(() => {
            cy.get('span.list-group-item').should('have.length', 2);
            cy.get('span.list-group-item').eq(0).should('contain', 'second visible task');
            cy.get('span.list-group-item').eq(1).should('contain', 'task to be swapped');
        });

        cy.get('.nav-tabs').contains('a', 'Later').click();
        cy.get('.modal').contains('button', 'Unlock').click();
        cy.wait(1000);
        cy.get('.nav-tabs').contains('a', 'Later').click();
        cy.wait(1000);

        cy.get('.tab-pane.active').within(() => {
            cy.get('span.list-group-item').should('have.length', 1);
            cy.get('span.list-group-item').eq(0).should('contain', 'first invisible task');
        });

        cy.get('.escalate').click();
        cy.wait(1000);

        cy.get('.tab-pane.active').within(() => {
            cy.get('span.list-group-item').should('have.length', 1);
            cy.get('span.list-group-item').eq(0).should('contain', 'task to be swapped');
        });
    });

    it('includes moving todos on the hidden list', () => {
        cy.get('input[type="text"]').type('first task');
        cy.contains('button', 'Do!').click();
        cy.contains('button', 'Later').click();
        cy.wait(1000);
        cy.get('input[type="text"]').type('second task');
        cy.contains('button', 'Do!').click();
        cy.contains('button', 'Later').click();
        cy.wait(1000);
        cy.get('input[type="text"]').type('third task');
        cy.contains('button', 'Do!').click();
        cy.contains('button', 'Later').click();
        cy.wait(1000);
        cy.get('input[type="text"]').type('fourth task');
        cy.contains('button', 'Do!').click();
        cy.contains('button', 'Later').click();
        cy.wait(1000);


        cy.get('.nav-tabs').contains('a', 'Later').click();
        cy.get('.modal').contains('button', 'Unlock').click();
        cy.wait(1000);
        cy.get('.nav-tabs').contains('a', 'Later').click();
        cy.wait(1000);

        cy.get('.tab-pane.active').within(() => {
            cy.get('span.list-group-item').should('have.length', 4);
            cy.get('span.list-group-item').eq(0).should('contain', 'first task');
            cy.get('span.list-group-item').eq(1).should('contain', 'second task');
            cy.get('span.list-group-item').eq(2).should('contain', 'third task');
            cy.get('span.list-group-item').eq(3).should('contain', 'fourth task');
        });

        var dt = new DataTransfer();
        cy.get('span.list-group-item').eq(0)
            .trigger('dragstart', {dataTransfer: dt})
            .trigger('drag', {dataTransfer: dt});
        cy.get('span.list-group-item').eq(2)
            .trigger('dragenter', {dataTransfer: dt})
            .trigger('drop', {dataTransfer: dt})
            .trigger('dragend', {dataTransfer: dt});
        cy.wait(1000);

        cy.get('.tab-pane.active').within(() => {
            cy.get('span.list-group-item').eq(0).should('contain', 'second task');
            cy.get('span.list-group-item').eq(1).should('contain', 'third task');
            cy.get('span.list-group-item').eq(2).should('contain', 'first task');
            cy.get('span.list-group-item').eq(3).should('contain', 'fourth task');
        });

        var dt = new DataTransfer();
        cy.get('span.list-group-item').eq(3)
            .trigger('dragstart', {dataTransfer: dt})
            .trigger('drag', {dataTransfer: dt});
        cy.get('span.list-group-item').eq(1)
            .trigger('dragenter', {dataTransfer: dt})
            .trigger('drop', {dataTransfer: dt})
            .trigger('dragend', {dataTransfer: dt});
        cy.wait(1000);

        cy.get('.tab-pane.active').within(() => {
            cy.get('span.list-group-item').eq(0).should('contain', 'second task');
            cy.get('span.list-group-item').eq(1).should('contain', 'fourth task');
            cy.get('span.list-group-item').eq(2).should('contain', 'third task');
            cy.get('span.list-group-item').eq(3).should('contain', 'first task');
        });
    });

    it('hides the hidden list after its unlock period expires', () => {
        cy.get('input[type="text"]').type('invisible task');
        cy.contains('button', 'Do!').click();
        cy.contains('button', 'Later').click();
        cy.wait(1000);

        cy.get('.tab-pane.active').within(() => {
            cy.get('span.list-group-item').should('not.contain', 'invisible task');
        });

        cy.clock();
        cy.get('.nav-tabs').contains('a', 'Later').click();
        cy.get('.modal').contains('button', 'Unlock').click();
        cy.wait(1000);
        cy.get('.nav-tabs').contains('a', 'Later').click();
        cy.wait(1000);

        cy.get('.tab-pane.active').within(() => {
            cy.get('span.list-group-item').should('contain', 'invisible task');
        });

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
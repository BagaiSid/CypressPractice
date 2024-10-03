/// <reference types="Cypress" />

// cypress - Spec "any test is called as spec file in cypress"

describe('My First Test Suite', function () {
  it('My First Test Case', function () {
    cy.visit('https://rahulshettyacademy.com/AutomationPractice/');

    // Check Boxes
    // ".check()" is used for checking the unchecked box
    // performing for single check box
    cy.get('#checkBoxOption1')
      .check()
      .should('be.checked')
      .and('have.value', 'option1');

    cy.get('#checkBoxOption1').uncheck().should('not.be.checked');

    // Selecting multiple check boxes at once
    cy.get('input[type="checkbox"]').check(['option1', 'option3']);

    //Static Drop-Downs
    cy.get('select').select('option2').should('have.value', 'option2');

    // Dynamic Drop-Down or autocomplete
    cy.get('#autocomplete').type('ind');

    cy.get('.ui-menu-item div').each(($el, index, $list) => {
      if ($el.text() === 'India') {
        $el.click();
      }
    });
    cy.get('#autocomplete').should('have.value', 'India');

    // Hidden or visible elements
    cy.get('#displayed-text').should('be.visible');
    cy.get('#hide-textbox').click();
    cy.get('#displayed-text').should('not.be.visible');
    cy.get('#show-textbox').click();
    cy.get('#displayed-text').should('be.visible');

    // Radio Button
    cy.get('[value="radio2"]').click();

    // Alerts
    cy.get('#name').type('Sid');
    cy.get('#alertbtn').click();
    cy.on('window:alert', (str) => {
      // this is a part of Mocha framework
      expect(str).to.be.equal(
        'Hello Sid, share this practice page and share your knowledge'
      );
    });
  });
});

/// <reference types="cypress" />

describe('My First Test Suite', function () {
  it('My First Test Case', function () {
    cy.visit('https://rahulshettyacademy.com/AutomationPractice/');
    cy.get('#opentab').invoke('removeAttr', 'target').click();

    cy.origin('https://www.qaclickacademy.com/', () => {
      cy.get("#navbarSupportedContent a[href*='about']").click();
      cy.get('.col-lg-5 h2').should(
        'contain.text',
        'Welcome to QAClick Academy'
      );
    });
  });
});

/// <reference types="Cypress" />

// cypress - Spec "any test is called as spec file in cypress"

describe('My First Test Suite', function () {
  it('My First Test Case', function () {
    cy.visit('https://rahulshettyacademy.com/seleniumPractise/#/');
    cy.get('.search-keyword').type('be');
    // cy.wait(4000);

    cy.get('.products').as('productLocator');

    console.log('Printing the example of console logging');
    // cy.get('.products').find('.product').eq(4).contains('ADD TO CART').click();
    cy.get('@productLocator')
      .find('.product')
      .each(($el, index, $list) => {
        const textItem = $el.find('h4.product-name').text();
        if (textItem.includes('Stra')) {
          cy.wrap($el).find('button').click();
        }
      });
    // assert if log is correctly displayed
    cy.get('.brand').should('have.text', 'GREENKART');
    // This is to print in logs
    cy.get('.brand').then(function (logoElement) {
      cy.log(logoElement.text());
    });

    // clicking on cart icon
    cy.get('.cart-icon').as('cartButton');

    cy.get('@cartButton').click();

    cy.contains('PROCEED TO CHECKOUT').click();

    cy.contains('Place Order').click();

    cy.get('select').select('India');

    cy.get('select').should('have.value','India')
  });
});

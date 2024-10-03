/// <reference types="Cypress" />

// cypress - Spec "any test is called as spec file in cypress"

describe('My First Test Suite', function () {
  it('My First Test Case', function () {
    cy.visit('https://rahulshettyacademy.com/seleniumPractise/#/');
    cy.get('.search-keyword').type('be');
    // cy.wait(2000);

    // In Selenium 'get' is used to hit url in browser. However, in cypress 'get' acts like finding the elements like 'findElements' of selenium
    // 'visible' is used if there is any element which is hidden in the webpage, it eleminates those are hidden.

    cy.get('.products').as('productLocator');
    cy.get('.product:visible').should('have.length', 5);
    // Parent child chaining
    cy.get('@productLocator').find('.product').should('have.length', 5);

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
  });
});

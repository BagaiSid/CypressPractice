/// <reference types = "cypress"/>
/// <reference types = "cypress-iframe"/>
import 'cypress-iframe';

describe('iFrames Test', function () {
  it('iFrame example', function () {
    cy.visit('https://rahulshettyacademy.com/AutomationPractice/');

    cy.frameLoaded('#courses-iframe');

    cy.iframe().find("a[href*='mentorship']").eq(0).click();
    // cy.iframe().find("h1[class*='pricing-title']").should('have.class', 'active');

    cy.wait(1000)

    cy.iframe().find("h1[class*='pricing-title']").should('have.length', 2);
  });
});

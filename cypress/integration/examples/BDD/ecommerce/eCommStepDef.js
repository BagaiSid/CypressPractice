/// <reference types="cypress" />
// import HomePage from "cypress/support/pageObjects/HomePage.js";
import shopPage from "../../../../support/pageObjects/ShopPage.js";
import {
  Given,
  When,
  Then,
  And,
} from "@badeball/cypress-cucumber-preprocessor";

Given("I open ECommerce Page", () => {
  cy.visit(Cypress.env("testUrl") + this.data.endPoint);
  
});

When("I add items to cart", () => {
  this.data.productName;
  this.data.productName.forEach(function (element) {
    cy.selectProd(element);

    const shopPg = new shopPage();

    shopPg.buttonCheckOut().click();
  });
});
/*
And("Validate the Item Prices", () => {
  cy.totalSum();
  cy.totalPrice();
});
*/
Then("Select the country, submit and verify Thank You!", () => {
  shopPage.country().type(this.data.country);

  shopPage.countrySuggestion().click();
  shopPage.checkBox().click({ force: true });
  shopPage.buttonSubmit().click();
  shopPage.alertText().then(function (element) {
    const actualText = element.text();
    expect(actualText.includes("Success")).to.be.true;
  });
});

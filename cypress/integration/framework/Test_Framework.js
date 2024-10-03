/// <reference types="cypress"/>
import homePage from '../examples/pageObjects/HomePage';
import shopPage from '../examples/pageObjects/ShopPage';

describe('Shopping Site', () => {
  before(() => {
    // root-level hook
    // runs once before all tests
    cy.fixture('example').then(function (data) {
      this.data = data;
    });
  });

  it('Framework Hooks', function () {
    const homePg = new homePage();
    cy.visit(Cypress.env('testUrl') + this.data.endPoint);
    homePg.getEditBox().type(this.data.name);
    homePg.getGender().select(this.data.gender);
    homePg.getTwoWayDataBinding().should('have.value', this.data.name);
    homePg.getMinimumLength().should('have.attr', 'minlength', 2);
    // cy.debug();
    homePg.getRadioButton().should('be.disabled');
    homePg.getShopURL().click();
    // cy.wait(1000);
    this.data.productName;
    this.data.productName.forEach(function (element) {
      cy.selectProd(element);
    });

    const shopPg = new shopPage();

    shopPg.buttonCheckOut().click();

    // A Command is created for the totalSum function
    cy.totalSum();
    cy.totalPrice();

    this.data.actualText;
    shopPg.buttonSuccess().click();

    shopPg.country().type(this.data.country);

    shopPg.countrySuggestion().click();
    shopPg.checkBox().click({ force: true });
    shopPg.buttonSubmit().click();
    shopPg.alertText().then(function (element) {
      const actualText = element.text();
      expect(actualText.includes('Success')).to.be.true;
    });
  });
});

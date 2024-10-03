class homePage {
  getEditBox() {
    return cy.get('input[name="name"]:nth-child(2)');
  }

  getGender() {
    return cy.get('select');
  }

  getRadioButton() {
    return cy.get('#inlineRadio3');
  }

  getTwoWayDataBinding() {
    return cy.get(':nth-child(4) > .ng-untouched');
  }

  getMinimumLength() {
    return cy.get('input[name="name"]:nth-child(2)');
  }

  getShopURL() {
    return cy.get(".nav-item a[href*='shop']");
  }
}
export default homePage;

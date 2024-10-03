class shopPage {
  productName() {
    return cy.get('h4.card-title');
  }
  addBtn() {
    return cy.get('button.btn.btn-info');
  }
  buttonCheckOut() {
    return cy.get('.nav-item.active');
  }

  buttonSuccess() {
    return cy.get('button.btn.btn-success');
  }

  country() {
    return cy.get('#country');
  }
  countrySuggestion() {
    // Cypress.config('defaultCommandTimeout', 8000);
    return cy.get('.suggestions');
    // return cy.wait(5000).get('.suggestions');
  }
  checkBox() {
    return cy.get("input[type='checkbox']");
  }

  buttonSubmit() {
    return cy.get("input[type='submit']");
  }

  alertText() {
    return cy.get('.alert');
  }

  productPrice() {
    return cy.get('tr td:nth-child(4) strong');
  }

  totalprice() {
    return cy.get('h3 strong');
  }
}

export default shopPage;

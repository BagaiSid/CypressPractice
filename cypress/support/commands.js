// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//

// import cypress from 'cypress';

import shopPage from "./pageObjects/ShopPage";

// import shopPage from "../integration/support/pageObjects/shopPage";

const shopPg = new shopPage();
Cypress.Commands.add("selectProd", (prodName) => {
  shopPg.productName().each(($el, index, $list) => {
    if ($el.text().includes(prodName)) {
      shopPg.addBtn().eq(index).click();
    }
  });
});

var sum = 0;

Cypress.Commands.add("totalSum", (price) => {
  shopPg
    .productPrice()
    .each(($el, index, $list) => {
      const amount = $el.text();
      var res = amount.split(" ");
      res = res[1].trim();
      sum = Number(sum) + Number(res);
      cy.log(res);
      console.log($el.text());
    })
    .then(function () {
      cy.log(sum);
      console.log(sum);
    });
});

Cypress.Commands.add("totalPrice", (totalPrice) => {
  shopPg.totalprice().then(function (element) {
    const amount = element.text();
    var res = amount.split(" ");
    var total = res[1].trim();
    expect(Number(total)).to.equal(Number(sum));
  });
});

// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

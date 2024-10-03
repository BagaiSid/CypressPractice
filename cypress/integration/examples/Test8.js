describe('Handling Child Windows', () => {
  it('Performing Mouse Hover', () => {
    cy.visit('https://rahulshettyacademy.com/AutomationPractice/');

    cy.get('#opentab').then(function (el) {
      const url = el.prop('href');
      cy.visit(url);
      cy.origin(url, () => {
        cy.get("div.sub-menu-bar a[href*='about']").click();
        // console.log(url);
      });
      // cy.get('#opentab').click();
    });
  });
});

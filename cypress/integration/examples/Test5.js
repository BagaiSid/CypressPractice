describe('Handling Child Windows', () => {
  it('Should handle child window', () => {
    cy.visit('https://rahulshettyacademy.com/seleniumPractise/#/');

    cy.get('.blinkingText').invoke('removeAttr', 'target').click();
    // cy.wait(2000);
    cy.get('.dropdown-menu')
      .select('more:visible')
      .should('have.value', 'About');
    cy.get('.dropdown-menu:visible').should('have.length', 5);

    // a[href*='about-my-mission']").click();
  });
});

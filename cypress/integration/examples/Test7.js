describe('Handling Child Windows', () => {
  it('Performing Mouse Hover', () => {
    cy.visit('https://rahulshettyacademy.com/AutomationPractice/');
    // cy.get('div.mouse-hover-content').invoke('show'); //One way to do this
    cy.contains('Top').click({force:true});
    cy.url().should('include', 'top');
  });
});

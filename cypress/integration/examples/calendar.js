describe('Calendar test', () => {
  it('Selecting date via calendar', () => {
    const month = '9';
    const date = '15';
    const year = '2024';
    const expectedDate = [month, date, year];

    cy.visit('https://rahulshettyacademy.com/seleniumPractise/#/offers');
    cy.get('.react-date-picker__inputGroup').click();
    cy.get('.react-calendar__navigation__label').click();
    cy.get('.react-calendar__navigation__label').click();
    cy.contains('button', year).click();
    cy.get('.react-calendar__year-view__months__month')
      .eq(Number(month) - 1)
      .click();
    cy.contains('abbr', date).click();

    // Assertion
    cy.get('.react-date-picker__inputGroup__input').each(($el, index) => {
      cy.wrap($el).invoke('val').should('eq',expectedDate[index]);
    });
  });
});

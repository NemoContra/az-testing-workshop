describe('AzTestingWorkshop', () => {
  beforeEach(() => {
    cy.intercept('/api/contracts', [])
    cy.visit('/');
  });

  it('should display the app', () => {
    cy.get('contract-table').should('be.visible');
  });
});

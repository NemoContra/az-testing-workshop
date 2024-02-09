import { mockContracts } from '@az-testing-workshop/shared/util/mock-data';

describe('AzTestingWorkshop', () => {
  beforeEach(() => {
    cy.intercept('/api/contracts', mockContracts);
    cy.visit('/');
  });

  it('should display the app with the table', () => {
    cy.get('contract-table').should('be.visible');
    cy.get('contract-table input').should('be.visible');
  });
});

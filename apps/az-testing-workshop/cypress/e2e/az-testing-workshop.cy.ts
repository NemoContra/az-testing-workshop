import { mockContracts } from '@az-testing-workshop/shared/util/mock-data';

describe('AzTestingWorkshop', () => {
  it('should have a table with the correct content and a search input', () => {
    cy.intercept('/api/contracts', mockContracts);
    cy.visit('/');

    cy.get('contract-table').should('be.visible');
    cy.get('contract-table input').should('be.visible');
    cy.get('contract-table table').should('be.visible');
    cy.get('contract-table table tbody tr').should('have.length', 2);
  });

  it('should show an empty table hint when emitting an empty response', () => {
    cy.intercept('/api/contracts', []);
    cy.visit('/');
  });

  it('should navigate to the details page when opening the context menu of a contract', () => {
    cy.intercept('/api/contracts', mockContracts);
    cy.visit('/');
  });

  it('should navigate to transaction "Nachname äendern"', () => {
    cy.intercept('/api/contracts', mockContracts);
    cy.visit('/');
  });
});

import { mockContracts } from '@az-testing-workshop/shared/util/mock-data';

describe('AzTestingWorkshop', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should have a table with the correct content and a search input', () => {
    cy.intercept('/api/contracts', mockContracts);

    cy.get('contract-table').should('be.visible');
    cy.get('contract-table input').should('be.visible');
    cy.get('contract-table table').should('be.visible');
    cy.get('contract-table table tbody tr').should('have.length', 2);
  });

  it('should show an empty table hint when emitting an empty response', () => {
    cy.intercept('/api/contracts', []);

    cy.get('contract-table table tbody tr').should('have.length', 1);
    cy.get('contract-table table tbody tr td').should(
      'have.text',
      'Keine Verträge vorhanden.'
    );
  });

  it('should navigate to the details page when opening the context menu of a contract', () => {
    cy.intercept('/api/contracts', mockContracts);

    cy.get('contract-table').should('be.visible');

    cy.get('contract-table tbody tr td button').eq(0).click();

    cy.contains('Details anzeigen').click();

    cy.url().should('contain', '/details/123456789');
  });

  it('should navigate to transaction "Nachname äendern"', () => {
    cy.intercept('/api/contracts', mockContracts);

    cy.get('contract-table').should('be.visible');

    cy.get('contract-table tbody tr td button').eq(0).click();

    cy.contains('Nachname ändern').click();

    cy.url().should(
      'contain',
      '/transaktion/123456789?transaktion=AenderungNachname'
    );
  });
});

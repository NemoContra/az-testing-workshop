import { registerLocaleData } from '@angular/common';
import localeDE from '@angular/common/locales/de';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { NxExpertModule } from '@aposin/ng-aquila/config';

import { ContractTableComponent } from './contract-table.components';
import { createOutputSpy, MountConfig } from 'cypress/angular';
import { expectCorrectTableRow } from '../../../../cypress/support/helpers.po';
import { provideRouter } from '@angular/router';
import { LOCALE_ID } from '@angular/core';
import { mockContracts } from '@az-testing-workshop/shared/util/mock-data';
import { DummyRouterDestinationComponent } from '@az-testing-workshop/shared/util/test-helpers';
import { ComponentFixture } from '@angular/core/testing';

registerLocaleData(localeDE);

describe(ContractTableComponent.name, () => {
  const mountConfig: MountConfig<ContractTableComponent> = {
    imports: [NxExpertModule, ContractTableComponent, DummyRouterDestinationComponent],
    providers: [
      provideNoopAnimations(),
      provideRouter([
        {
          path: '**',
          component: DummyRouterDestinationComponent,
        },
      ]),
      { provide: LOCALE_ID, useValue: 'de-DE' },
    ],
  };

  beforeEach(() => {
    cy.viewport(1600, 800);
  });

  it('should show the correct contracts which are provided as input value', () => {
    cy.mount(ContractTableComponent, {
      ...mountConfig,
      componentProperties: { contracts: mockContracts },
    });

    cy.get('div.scroll-container table[nxTable]').should('be.visible');

    cy.get('table thead tr th').should('have.length', 7);
    cy.get('table thead tr th').eq(0).should('have.text', 'Vertragsnummer');
    cy.get('table thead tr th').eq(1).should('have.text', 'Vorname');
    cy.get('table thead tr th').eq(2).should('have.text', 'Nachname');
    cy.get('table thead tr th').eq(3).should('have.text', 'Geburtsdatum');
    cy.get('table thead tr th').eq(4).should('have.text', 'Vertragsbeginn');
    cy.get('table thead tr th').eq(5).should('have.text', 'Vertragsende');
    cy.get('table thead tr th').eq(6).should('have.text', 'Aktion');

    cy.get('table tbody tr').should('have.length', 2);
    cy.get('table tbody tr').eq(0).find('td').should('have.length', 7);
    cy.get('table tbody tr').eq(1).find('td').should('have.length', 7);

    expectCorrectTableRow(
       0,
       '1/2345678/9',
       'Homer',
       'Simpson',
       '16.05.1961',
       '01.01.2024',
       '',
    );
    expectCorrectTableRow(
       1,
       '1/2345678/8',
       'Bart',
       'Simpson',
       '21.08.1995',
       '01.02.2024',
       '',
    );
  });

  it('should have a context-menu with the correct entries', () => {
    cy.mount(ContractTableComponent, {
      ...mountConfig,
      componentProperties: { contracts: mockContracts },
    });

    cy.get('nx-context-menu').should('not.be.visible');

    cy.get('table tbody tr').eq(0).find('td').eq(6).find('button').click();

    cy.get('div.nx-context-menu').should('be.visible');
    cy.get('div.nx-context-menu button').should('have.length', 4);

    cy.get('div.nx-context-menu button')
       .eq(0)
       .should('contain.text', 'Details anzeigen');
    cy.get('div.nx-context-menu button')
       .eq(0)
       .should('have.attr', 'type', 'button');
    cy.get('div.nx-context-menu button')
       .eq(0)
       .should('have.attr', 'nxContextMenuItem');

    cy.get('div.nx-context-menu button')
       .eq(1)
       .should('contain.text', 'Transaktion durchführen');
    cy.get('div.nx-context-menu button')
       .eq(1)
       .should('have.attr', 'type', 'button');
    cy.get('div.nx-context-menu button')
       .eq(1)
       .should('have.attr', 'nxContextMenuItem');

    cy.get('div.nx-context-menu button')
       .eq(2)
       .should('contain.text', 'Nachname ändern');
    cy.get('div.nx-context-menu button')
       .eq(2)
       .should('have.attr', 'type', 'button');
    cy.get('div.nx-context-menu button')
       .eq(2)
       .should('have.attr', 'nxContextMenuItem');

    cy.get('div.nx-context-menu button')
       .eq(3)
       .should('contain.text', 'Kündigung');
    cy.get('div.nx-context-menu button')
       .eq(3)
       .should('have.attr', 'type', 'button');
    cy.get('div.nx-context-menu button')
       .eq(3)
       .should('have.attr', 'nxContextMenuItem');
    // TODO: Test navigation
  });

  it('should show an empty table hint if no contracts are provided', () => {
    cy.mount(ContractTableComponent, {
      ...mountConfig,
      componentProperties: { contracts: [] },
    });

    cy.get('table tbody tr td').should('have.length', 1);
    cy.get('table tbody tr td').should(
       'have.text',
       'Keine Verträge vorhanden.',
    );
  });

  it('should emit the correct output event when searching for a contract', async () => {
    let fixture: ComponentFixture<ContractTableComponent>;

    cy.mount<ContractTableComponent>('<contract-table [contracts]="contracts" (queryChange)="queryChange.emit($event)"></contract-table>', {
      ...mountConfig,
      componentProperties: { contracts: mockContracts, queryChange: createOutputSpy<string>('queryChangeSpy')},
    }).then(component => {
      fixture = component.fixture;
    });

    cy.get('nx-formfield input').type('Homer');

    cy.get('@queryChangeSpy').should('have.been.calledOnce');
    cy.get('@queryChangeSpy').should('have.been.calledWith', 'Homer');
  });
});

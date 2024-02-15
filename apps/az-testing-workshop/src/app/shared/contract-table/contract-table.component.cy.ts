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
import { mockComponent } from '@az-testing-workshop/shared/util/test-helpers';

registerLocaleData(localeDE);

describe(ContractTableComponent.name, () => {
  const mountConfig: MountConfig<ContractTableComponent> = {
    imports: [NxExpertModule, ContractTableComponent],
    providers: [
      provideNoopAnimations(),
      provideRouter([
        {
          path: '**',
          component: mockComponent({ selector: 'routing-dummy' }),
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
  });

  it('should have a context-menu with the correct entries', () => {
    cy.mount(ContractTableComponent, {
      ...mountConfig,
      componentProperties: { contracts: mockContracts },
    });
  });

  it('should show an empty table hint if no contracts are provided', () => {
    cy.mount(ContractTableComponent, {
      ...mountConfig,
      componentProperties: { contracts: [] },
    });
  });

  it('should emit the correct output event when searching for a contract', async () => {
    cy.mount<ContractTableComponent>(
      '<contract-table [contracts]="contracts" (queryChange)="queryChange.emit($event)"></contract-table>',
      {
        ...mountConfig,
        componentProperties: {
          contracts: mockContracts,
          queryChange: createOutputSpy<string>('queryChangeSpy'),
        },
      }
    );

    cy.get('nx-formfield input').type('Homer');
  });
});

import { registerLocaleData } from '@angular/common';
import localeDE from '@angular/common/locales/de';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { NxExpertModule } from '@aposin/ng-aquila/config';

import { MountConfig } from 'cypress/angular';
import { LOCALE_ID } from '@angular/core';
import { mockContracts } from '@az-testing-workshop/test-helpers';
import ContractDetailsComponent from './contract-details.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

registerLocaleData(localeDE);

describe(ContractDetailsComponent.name, () => {
  const mountConfig: MountConfig<ContractDetailsComponent> = {
    imports: [
      NxExpertModule
    ],
    providers: [provideNoopAnimations(), provideRouter([]), provideHttpClient(), {
      provide: LOCALE_ID,
      useValue: 'de-DE'
    }]
  };

  beforeEach(() => {
    // cy.viewport(1600, 800);
  });


  it.only('should render content with contract-display component if http call is returning data successfully', () => {
    cy.intercept('/api/contracts/123456789', mockContracts[0]).as('contract');

    cy.mount(ContractDetailsComponent, { ...mountConfig, componentProperties: { id: '123456789' } }).wait('@contract');

    cy.get('nx-spinner').should('not.be.visible');
    cy.get('div.content contract-display').should('be.visible');
    cy.get('nx-error').should('not.be.visible');
  });

  it('should show a loading spinner if http call is loading', () => {
    cy.intercept('/api/contracts/123456789', mockContracts[0]).as('contract');

    cy.mount(ContractDetailsComponent, { ...mountConfig, componentProperties: { id: '123456789' } });

    cy.get('nx-spinner').should('be.visible');
    cy.get('div.content contract-display').should('not.be.visible');
    cy.get('nx-error').should('not.be.visible');
  });

  it('should show an error if htpp call is returning an error ', () => {
    cy.intercept('/api/contracts/123456789', { statusCode: 500 }).as('contract');

    cy.mount(ContractDetailsComponent, { ...mountConfig, componentProperties: { id: '123456789' } });

    cy.wait('@contract');

    cy.get('nx-spinner').should('not.be.visible');
    cy.get('div.content contract-display').should('not.be.visible');
    cy.get('nx-error').should('be.visible');
    cy.get('nx-error').should('have.text', 'An error occurred');
  });
});

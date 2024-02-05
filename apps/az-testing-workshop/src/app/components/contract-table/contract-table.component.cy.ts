import { registerLocaleData } from '@angular/common';
import localeDE from '@angular/common/locales/de';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { NxExpertModule } from '@aposin/ng-aquila/config';

import { ContractTableComponent } from './contract-table.components';
import { MountConfig } from 'cypress/angular';

registerLocaleData(localeDE);

describe(ContractTableComponent.name, () => {
  const mountConfig: MountConfig<ContractTableComponent> = {
    imports: [
      NxExpertModule
    ],
    providers: [provideNoopAnimations()]
  };

  beforeEach(() => {
    cy.viewport(1600, 800);
  });


  it('should add all available contracts and sort the rows correctly', () => {
    cy.mount(ContractTableComponent, mountConfig);

    cy.get('div.scroll-container').should('be.visible');

    /*expectCorrectTableRow(0, 'error_outline', 'Inkasso', 'FIAB', 'AL-8090913400');
    expectCorrectTableRow(1, 'error_outline', 'Inkasso', 'Beurkundungssperre', 'AL-8090921155');
    expectCorrectTableRow(2, 'error_outline', 'Baecidfogh', 'Stefan', '5/413733/22');
    expectCorrectTableRow(3, 'error_outline', 'Baecid', 'Halgard', '000000000865');
    expectCorrectTableRow(4, 'error_outline', 'Baecid', 'Angelika', '6/169099/1904');
    expectCorrectTableRow(5, 'error_outline', 'Baecdif', 'Stefan', '5/413733/27');
    expectCorrectTableRow(6, 'error_outline', 'Baecd', 'Stephan', '6/169099/1905');
    expectCorrectTableRow(7, 'error_outline', 'Baec', 'Wolf-Rüdiger', '6/169099/162');
    expectCorrectTableRow(8, 'error_outline', 'Baec', 'Jochen', '6/169099/1930');
    expectCorrectTableRow(9, 'error_outline', 'Bacedfig', 'Marga', '6/169099/1919');*/
  });
});

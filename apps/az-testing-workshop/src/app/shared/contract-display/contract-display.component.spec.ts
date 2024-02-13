import { createComponentFactory } from '@ngneat/spectator/jest';
import { ContractDisplayComponent } from './contract-display.component';
import { NxDataDisplayComponent } from '@aposin/ng-aquila/data-display';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { LOCALE_ID } from '@angular/core';
import {
  mixinHarnessLoader,
  NxDataDisplayHarness,
} from '@az-testing-workshop/shared/util/test-harnesses';

registerLocaleData(localeDe);

describe('ContractDisplayComponent', () => {
  const createComponent = mixinHarnessLoader(
    createComponentFactory({
      component: ContractDisplayComponent,
      providers: [{ provide: LOCALE_ID, useValue: 'de-DE' }],
      detectChanges: false,
    })
  );

  it('should show the correct fields of a provided contract', async () => {
    const spectator = createComponent({
      props: {
        contract: {
          id: '123456789',
          contractNumber: '1/2345678/9',
          start: '2024-01-01',
          end: '2056-01-31',
          premium: 42.42,
          person: {
            firstname: 'Homer',
            lastname: 'Simpson',
            dateOfBirth: '1961-05-16',
          },
        },
      },
    });

    spectator.detectChanges();

    const nxDataDisplayHarnesses = await spectator.loader.getAllHarnesses(
      NxDataDisplayHarness
    );
  });

  it('should show no fields if no contract is provided', () => {
    const spectator = createComponent();

    spectator.detectChanges();
  });
});

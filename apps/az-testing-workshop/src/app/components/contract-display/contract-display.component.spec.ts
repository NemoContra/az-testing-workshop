import { createComponentFactory } from '@ngneat/spectator/jest';
import { ContractDisplayComponent } from './contract-display.component';
import {
  NxDataDisplayComponent,
  NxDataDisplayModule,
} from '@aposin/ng-aquila/data-display';
import { MockModule } from 'ng-mocks';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { LOCALE_ID } from '@angular/core';
import { mockContracts } from '@az-testing-workshop/shared/util/mock-data';

registerLocaleData(localeDe);

describe('ContractDisplayComponent', () => {
  const createComponent = createComponentFactory({
    component: ContractDisplayComponent,
    providers: [{ provide: LOCALE_ID, useValue: 'de-DE' }],
    overrideComponents: [
      [
        ContractDisplayComponent,
        {
          remove: { imports: [NxDataDisplayModule] },
          add: { imports: [MockModule(NxDataDisplayModule)] },
        },
      ],
    ],
    detectChanges: false,
  });

  it('should show the correct fields of a provided contract', () => {
    const spectator = createComponent({
      props: {
        contract:   {
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

    expect(spectator.fixture).toMatchSnapshot();

    const dataDisplays = spectator.queryAll(NxDataDisplayComponent);

    expect(dataDisplays.length).toEqual(6);

    expect(dataDisplays[0].label).toEqual('Vertragsnummer');
    expect(dataDisplays[0].size).toEqual(undefined);
    expect(dataDisplays[0].orientation).toEqual(undefined);

    expect(dataDisplays[1].label).toEqual('Vertragsbeginn');
    expect(dataDisplays[1].size).toEqual(undefined);
    expect(dataDisplays[1].orientation).toEqual(undefined);

    expect(dataDisplays[2].label).toEqual('Vertragsende');
    expect(dataDisplays[2].size).toEqual(undefined);
    expect(dataDisplays[2].orientation).toEqual(undefined);

    expect(dataDisplays[3].label).toEqual('Vorname');
    expect(dataDisplays[3].size).toEqual(undefined);
    expect(dataDisplays[3].orientation).toEqual(undefined);

    expect(dataDisplays[4].label).toEqual('Nachname');
    expect(dataDisplays[4].size).toEqual(undefined);
    expect(dataDisplays[4].orientation).toEqual(undefined);

    expect(dataDisplays[5].label).toEqual('Geburtsdatum');
    expect(dataDisplays[5].size).toEqual(undefined);
    expect(dataDisplays[5].orientation).toEqual(undefined);
  });

  it('should show the fields of an empty contract if no contract is provided', () => {
    const spectator = createComponent();

    spectator.detectChanges();

    expect(spectator.fixture).toMatchSnapshot();

    const dataDisplays = spectator.queryAll(NxDataDisplayComponent);

    expect(dataDisplays.length).toEqual(0);
  });
});

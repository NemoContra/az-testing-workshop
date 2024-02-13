import {
  byTextContent,
  createRoutingFactory,
  SpectatorRouting,
} from '@ngneat/spectator/jest';
import { LOCALE_ID } from '@angular/core';
import { MockModule } from 'ng-mocks';
import { ContractTableComponent } from './contract-table.components';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxLinkModule } from '@aposin/ng-aquila/link';
import { Location, registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { mockComponent } from '@az-testing-workshop/shared/util/test-helpers';
import { NxButtonHarness } from '@aposin/ng-aquila/button/testing';
import { mockContracts } from '@az-testing-workshop/shared/util/mock-data';
import { NxInputHarness } from '@az-testing-workshop/shared/util/test-harnesses';
import { fakeAsync, tick } from '@angular/core/testing';
import { createSpyObserver } from '@az-testing-workshop/shared/util/test-helpers/jest';

registerLocaleData(localeDe);

describe('ContractTableComponent', () => {
  let spectator: SpectatorRouting<ContractTableComponent>;
  let loader: HarnessLoader;

  const createComponent = createRoutingFactory({
    component: ContractTableComponent,
    providers: [{ provide: LOCALE_ID, useValue: 'de-DE' }],
    overrideComponents: [
      [
        ContractTableComponent,
        {
          remove: { imports: [NxIconModule, NxLinkModule] },
          add: {
            imports: [MockModule(NxIconModule), MockModule(NxLinkModule)],
          },
        },
      ],
    ],
    detectChanges: false,
    routes: [
      {
        path: 'details/:id',
        component: mockComponent({ selector: 'routing-dummy' }),
      },
      {
        path: 'transaktion/:id',
        component: mockComponent({ selector: 'routing-dummy' }),
      },
    ],
    stubsEnabled: false,
  });

  it('should show the correct contracts which are provided as input value', () => {
    spectator = createComponent({
      props: {
        contracts: mockContracts,
      },
    });

    spectator.detectChanges();
  });

  it('should have a context-menu with the correct entries', async () => {
    spectator = createComponent({
      props: {
        contracts: mockContracts,
      },
    });

    loader = TestbedHarnessEnvironment.loader(spectator.fixture);

    spectator.detectChanges();
  });

  test.each`
    label                        | routerLink                                                | queryParam
    ${'Details anzeigen'}        | ${'/details/123456789'}                                   | ${undefined}
    ${'Transaktion durchführen'} | ${'/transaktion/123456789'}                               | ${undefined}
    ${'Nachname ändern'}         | ${'/transaktion/123456789?transaktion=AenderungNachname'} | ${'AenderungNachname'}
    ${'Kündigung'}               | ${'/transaktion/123456789?transaktion=Kuendigung'}        | ${'Kuendigung'}
  `(
    'should have to correct routerLink for menu item $label',
    async ({ label, routerLink }) => {
      spectator = createComponent({
        props: {
          contracts: mockContracts,
        },
      });

      loader = TestbedHarnessEnvironment.loader(spectator.fixture);

      const actionMenuButtons = await loader.getAllHarnesses(NxButtonHarness);
      await actionMenuButtons[0].click();

      await spectator.fixture.whenStable();
    }
  );

  it('should show an empty table hint if no contracts are provided', () => {
    const spectator = createComponent({
      props: {
        contracts: [],
      },
    });

    spectator.detectChanges();
  });

  it('should emit the correct output event with 200ms debounceTime when searching for a contract', fakeAsync(async () => {
    const spectator = createComponent({
      props: {
        contracts: mockContracts,
      },
    });

    loader = TestbedHarnessEnvironment.loader(spectator.fixture);

    spectator.detectChanges();

    const outputEvent = createSpyObserver();
    spectator.output('queryChange').subscribe(outputEvent);

    const searchInput = await loader.getHarness(NxInputHarness);
  }));

  const expectCorrectTableRow = (
    index: number,
    contractNumber: string,
    firstname: string,
    lastname: string,
    dateOfBirth: string,
    start: string,
    ende: string
  ) => {
    const tableRow = spectator.queryAll('table[nxTable] tbody tr')[index];
    expect(tableRow.querySelectorAll('td')[0].textContent).toEqual(
      contractNumber
    );
    expect(tableRow.querySelectorAll('td')[1].textContent).toEqual(firstname);
    expect(tableRow.querySelectorAll('td')[2].textContent).toEqual(lastname);
    expect(tableRow.querySelectorAll('td')[3].textContent).toEqual(dateOfBirth);
    expect(tableRow.querySelectorAll('td')[4].textContent).toEqual(start);
    expect(tableRow.querySelectorAll('td')[5].textContent).toEqual(ende);
  };
});

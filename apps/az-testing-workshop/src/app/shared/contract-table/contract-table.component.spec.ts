import {
  byTextContent,
  createRoutingFactory,
  SpectatorRouting,
} from '@ngneat/spectator/jest';
import { ContractDisplayComponent } from '../contract-display/contract-display.component';
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
        ContractDisplayComponent,
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

    expect(
      spectator.query('div.scroll-container table[nxTable]')
    ).not.toBeNull();

    expect(spectator.queryAll(' table[nxTable] tbody tr').length).toEqual(2);

    expectCorrectTableRow(
      0,
      '1/2345678/9',
      'Homer',
      'Simpson',
      '16.05.1961',
      '01.01.2024',
      '-'
    );
    expectCorrectTableRow(
      1,
      '1/2345678/8',
      'Bart',
      'Simpson',
      '21.08.1995',
      '01.02.2024',
      '-'
    );
  });

  it('should have a context-menu with the correct entries', async () => {
    spectator = createComponent({
      props: {
        contracts: mockContracts,
      },
    });

    loader = TestbedHarnessEnvironment.loader(spectator.fixture);

    spectator.detectChanges();

    expect(
      spectator.query('div.scroll-container table[nxTable]')
    ).not.toBeNull();

    const tableRows = spectator.queryAll(' table[nxTable] tbody tr');

    expect(
      tableRows[0]
        .querySelectorAll('td')[6]
        .querySelector('button[nxIconButton="tertiary small"]')
    ).not.toBeNull();
    expect(
      tableRows[1]
        .querySelectorAll('td')[6]
        .querySelector('button[nxIconButton="tertiary small"]')
    ).not.toBeNull();

    const actionMenuButtons = await loader.getAllHarnesses(NxButtonHarness);

    expect(await actionMenuButtons[0].getType()).toEqual('icon');

    expect(spectator.query('div.nx-context-menu')).toBeNull();

    await actionMenuButtons[0].click();

    spectator.detectChanges();

    expect(spectator.query('div.nx-context-menu')).not.toBeNull();

    const actionMenuItems = spectator.queryAll('button.nx-context-menu-item');

    expect(actionMenuItems.length).toEqual(4);
    expect(actionMenuItems[0].textContent?.trim()).toEqual('Details anzeigen');
    expect(actionMenuItems[1].textContent?.trim()).toEqual(
      'Transaktion durchführen'
    );
    expect(actionMenuItems[2].textContent?.trim()).toEqual('Nachname ändern');
    expect(actionMenuItems[3].textContent?.trim()).toEqual('Kündigung');
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

      expect(
        spectator.query(byTextContent(label, { selector: 'button' }), {
          root: true,
        })
      ).not.toBeNull();

      spectator
        .query<HTMLButtonElement>(
          byTextContent(label, { selector: 'button' }),
          {
            root: true,
          }
        )
        ?.click();

      await spectator.fixture.whenStable();

      expect(spectator.inject(Location).path()).toBe(routerLink);
    }
  );

  it('should show an empty table hint if no contracts are provided', () => {
    const spectator = createComponent({
      props: {
        contracts: [],
      },
    });

    spectator.detectChanges();

    expect(
      spectator.query('div.scroll-container table[nxTable]')
    ).not.toBeNull();
    expect(
      spectator.queryAll('div.scroll-container table[nxTable] tbody tr').length
    ).toEqual(1);
    expect(
      spectator.queryAll('div.scroll-container table[nxTable] tbody tr td')
        .length
    ).toEqual(1);
    expect(
      spectator.query('div.scroll-container table[nxTable] tbody tr td')
        ?.textContent
    ).toEqual('Keine Verträge vorhanden.');
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

    await searchInput.writeValue('Homer');

    tick(100);

    expect(outputEvent.next).not.toHaveBeenCalled();
    expect(outputEvent.error).not.toHaveBeenCalled();
    expect(outputEvent.complete).not.toHaveBeenCalled();

    tick(100);

    expect(outputEvent.next).toHaveBeenCalledTimes(1);
    expect(outputEvent.next).toHaveBeenCalledWith('Homer');
    expect(outputEvent.error).not.toHaveBeenCalled();
    expect(outputEvent.complete).not.toHaveBeenCalled();

    await searchInput.writeValue('Homer');

    tick(300);

    expect(outputEvent.next).toHaveBeenCalledTimes(1);
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

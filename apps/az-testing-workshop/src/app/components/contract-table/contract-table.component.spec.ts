import { createRoutingFactory } from '@ngneat/spectator/jest';
import { ContractDisplayComponent } from '../contract-display/contract-display.component';
import { LOCALE_ID } from '@angular/core';
import { MockModule } from 'ng-mocks';
import { ContractTableComponent } from './contract-table.components';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxLinkModule } from '@aposin/ng-aquila/link';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';

registerLocaleData(localeDe);
describe('ContractTableComponent', () => {
  const createComponent = createRoutingFactory(
    {
      component: ContractTableComponent,
      providers: [{ provide: LOCALE_ID, useValue: 'de-DE' }],
      overrideComponents: [
        [ContractDisplayComponent, {
          remove: { imports: [NxIconModule, NxLinkModule] },
          add: { imports: [MockModule(NxIconModule), MockModule(NxLinkModule)] }
        }]
      ],
      detectChanges: false
    }
  );

  it('should show the correct contracts which are provided as input value', () => {
    const spectator = createComponent({
      props: {
        contracts: mockContracts
      }
    });

    spectator.detectChanges();

    // TODO: Test search input with harness

    expect(spectator.query('div.scroll-container table[nxTable]')).not.toBeNull();

  });

  it('should have a context-menu with the correct entries', () => {
    const spectator = createComponent({
      props: {
        contracts: mockContracts
      }
    });

    spectator.detectChanges();
  });

  it('should show an empty table hint if no contracts are provided', () => {
    const spectator = createComponent({
      props: {
        contracts: []
      }
    });

    spectator.detectChanges();
  });

  it('should emit the correct output event when searching for a contract', () => {
    const spectator = createComponent({
      props: {
        contracts: mockContracts
      }
    });

    spectator.detectChanges();
  });
});

const mockContracts = [
  {
    id: '123456789',
    contractNumber: '1/2345678/9',
    start: '2024-01-01',
    premium: 42.42,
    person: {
      firstname: 'Homer',
      lastname: 'Simpson',
      dateOfBirth: '1961-05-16',
    },
  },
  {
    id: '123456788',
    contractNumber: '1/2345678/8',
    start: '2024-02-01',
    premium: 99.0,
    person: {
      firstname: 'Bart',
      lastname: 'Simpson',
      dateOfBirth: '1995-08-21',
    },
  },
]

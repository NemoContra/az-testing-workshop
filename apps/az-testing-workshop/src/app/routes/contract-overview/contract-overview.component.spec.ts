import { createComponentFactory } from '@ngneat/spectator/jest';
import ContractOverviewComponent from './contract-overview.component';
import { Router } from '@angular/router';
import { ContractTableComponent } from '../../shared/contract-table/contract-table.components';
import { ContractOverviewStore } from './contract-overview.store';
import { signal } from '@angular/core';
import { Contract } from '@az-testing-workshop/shared/util/api-models';
import { MockComponent, MockModule } from 'ng-mocks';
import { NxErrorModule } from '@aposin/ng-aquila/base';
import { NxSpinnerModule } from '@aposin/ng-aquila/spinner';
import { mockContracts } from '@az-testing-workshop/shared/util/mock-data';

const createContractOverviewStoreMock = () => ({
  errorCode: signal<number | undefined>(undefined),
  loading: signal(false),
  contracts: signal<Contract[] | undefined>(undefined),
  setQuery: jest.fn(),
});

describe('ContractOverviewComponent', () => {
  let contractOverviewStoreMock: ReturnType<
    typeof createContractOverviewStoreMock
  >;

  const createComponent = createComponentFactory({
    component: ContractOverviewComponent,
    providers: [
      {
        provide: Router,
        useFactory: () => ({ navigate: jest.fn().mockResolvedValue(true) }),
      },
      {
        provide: ContractOverviewStore,
        useFactory: () =>
          (contractOverviewStoreMock = createContractOverviewStoreMock()),
      },
    ],
    overrideComponents: [
      [
        ContractOverviewComponent,
        {
          remove: {
            imports: [ContractTableComponent, NxErrorModule, NxSpinnerModule],
          },
          add: {
            imports: [
              MockComponent(ContractTableComponent),
              MockModule(NxErrorModule),
              MockModule(NxSpinnerModule),
            ],
          },
        },
      ],
    ],
  });

  it('should render loading-spinner', () => {
    const spectator = createComponent();
    contractOverviewStoreMock.loading.set(true);
    spectator.detectChanges();
  });

  it('should render error message', () => {
    const spectator = createComponent();
    contractOverviewStoreMock.errorCode.set(500);
    contractOverviewStoreMock.loading.set(false);
    spectator.detectChanges();
  });

  it('should render contracts-table', () => {
    const spectator = createComponent();
    contractOverviewStoreMock.contracts.set(mockContracts);
    spectator.detectChanges();
  });

  it('should trigger routing when search is used', () => {
    const spectator = createComponent();
    contractOverviewStoreMock.contracts.set(mockContracts);
    spectator.detectChanges();
    const router = spectator.inject(Router);
    spectator.triggerEventHandler('contract-table', 'queryChange', 'Bart');
  });

  it('should set the queryParam from router', () => {
    const spectator = createComponent({
      props: {
        query: 'Bart',
      },
    });
    contractOverviewStoreMock.contracts.set(mockContracts);
    spectator.detectChanges();
  });
});

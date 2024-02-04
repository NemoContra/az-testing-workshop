import { createHostFactory, mockProvider } from '@ngneat/spectator/jest';
import ContractOverviewComponent from './contract-overview.component';
import { Router } from '@angular/router';
import { ContractTableComponent } from '../../components/contract-table/contract-table.components';
import { ContractOverviewStore } from './contract-overview.store';
import { signal } from '@angular/core';
import { Contract } from '@az-testing-workshop/shared/util/api-models';
import { mockContracts } from '../../test-helpers/mock-contracts';
import { MockComponent, MockModule } from 'ng-mocks';
import { NxErrorModule } from '@aposin/ng-aquila/base';
import { NxSpinnerModule } from '@aposin/ng-aquila/spinner';

describe('ContractOverview', () => {
  const contractOverviewStoreMock = {
    errorCode: signal(false),
    loading: signal(false),
    contracts: signal<Contract[] | undefined>(undefined),
    setQuery: jest.fn(),
  };

  const createComponent = createHostFactory({
    component: ContractOverviewComponent,
    providers: [
      mockProvider(Router, { navigate: jest.fn().mockResolvedValue(true) }),
      mockProvider(ContractOverviewStore, contractOverviewStoreMock),
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

  afterEach(() => jest.clearAllMocks());

  it('should render loading-spinner', () => {
    contractOverviewStoreMock.loading.set(true);
    const spectator = createComponent('<contract-overview />');
    expect(spectator.fixture).toMatchSnapshot();
  });

  it('should render error message', () => {
    contractOverviewStoreMock.loading.set(false);
    contractOverviewStoreMock.errorCode.set(true);
    const spectator = createComponent('<contract-overview />');
    expect(spectator.fixture).toMatchSnapshot();
  });

  it('should render contracts-table', () => {
    contractOverviewStoreMock.contracts.set(mockContracts);
    const spectator = createComponent('<contract-overview />');
    expect(spectator.fixture).toMatchSnapshot();
    expect(spectator.query(ContractTableComponent)?.contracts).toEqual(
      mockContracts
    );
  });

  it('should trigger routing when search is used', () => {
    contractOverviewStoreMock.contracts.set(mockContracts);
    const spectator = createComponent('<contract-overview />');
    const router = spectator.inject(Router);
    spectator.triggerEventHandler('contract-table', 'queryChange', 'Bart');
    expect(router.navigate).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledWith([], {
      queryParams: {
        query: 'Bart',
      },
    });
  });

  it('should set the queryParam from router', () => {
    contractOverviewStoreMock.contracts.set(mockContracts);
    const spectator = createComponent('<contract-overview />', {
      props: {
        query: 'Bart',
      },
    });
    expect(contractOverviewStoreMock.setQuery).toHaveBeenCalledTimes(1);
    expect(contractOverviewStoreMock.setQuery).toHaveBeenCalledWith('Bart');
    spectator.setInput({ query: 'Simpson' });
    expect(contractOverviewStoreMock.setQuery).toHaveBeenCalledTimes(2);
    expect(contractOverviewStoreMock.setQuery).toHaveBeenNthCalledWith(
      2,
      'Simpson'
    );
  });
});

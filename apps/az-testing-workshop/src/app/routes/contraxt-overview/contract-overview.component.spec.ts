import { createHostFactory, mockProvider } from '@ngneat/spectator/jest';
import ContractOverviewComponent from './contract-overview.component';
import { provideRouter } from '@angular/router';
import { ContractTableComponent } from '../../components/contract-table/contract-table.components';
import { ContractOverviewStore } from './contract-overview.store';
import { signal } from '@angular/core';
import { Contract } from '@az-testing-workshop/shared/util/api-models';
import { mockContracts } from '../../test-helpers/mock-contracts';
import { MockComponent } from 'ng-mocks';

describe('ContractOverview', () => {
  const contractOverviewStoreMock = {
    errorCode: signal(false),
    loading: signal(false),
    contracts: signal<Contract[] | undefined>(undefined),
  };

  const createComponent = createHostFactory({
    component: ContractOverviewComponent,
    providers: [
      provideRouter([{ path: '', component: ContractOverviewComponent }]),
      mockProvider(ContractOverviewStore, contractOverviewStoreMock),
    ],
    componentMocks: [MockComponent(ContractTableComponent)],
  });

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
  });
});

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { ContractTransactionStore } from './contract-transaction.store';
import { ContractService } from '../../services/contract.service';
import { AsyncSubject, of } from 'rxjs';
import { mockContracts } from '@az-testing-workshop/shared/util/mock-data';
import { Contract } from '@az-testing-workshop/shared/util/api-models';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { optimisticUpdateContracts } from '../../common/optimistic-update-contracts';
import { ContractOverviewStore } from '../contract-overview/contract-overview.store';
import { patchState, signalState } from '@ngrx/signals';

const mockUpdatedContract: Contract = {
  ...mockContracts[0],
  person: {
    firstname: 'Berthold',
    lastname: 'Heisterkamp',
    dateOfBirth: '1961-05-16',
  },
};

const mockUpdatedContracts: Contract[] = [
  mockUpdatedContract,
  mockContracts[1],
];

jest.mock('@ngrx/signals', () => {
  const { patchState, ...module } = jest.requireActual('@ngrx/signals');
  return { ...module, patchState: jest.fn(patchState) };
});

jest.mock('../../common/optimistic-update-contracts', () => ({
  optimisticUpdateContracts: jest.fn(() => mockUpdatedContracts),
}));

describe('ContractTransactionStore', () => {
  let spectator: SpectatorService<
    InstanceType<typeof ContractTransactionStore>
  >;

  const createService = createServiceFactory({
    service: ContractTransactionStore,
    providers: [
      {
        provide: ContractService,
        useFactory: () => ({
          getContract: jest.fn().mockReturnValue(of(mockContracts[0])),
          getContracts: jest.fn().mockReturnValue(of(mockContracts)),
          updateContract: jest.fn().mockReturnValue(of(mockContracts[0])),
        }),
      },
      {
        provide: ContractOverviewStore,
        useFactory: () =>
          signalState({
            contracts: mockContracts,
          }),
      },
    ],
  });

  beforeEach(() => (spectator = createService()));

  afterEach(() => jest.clearAllMocks());

  it('should select transaction', () => {
    spectator.service.selectTransaction('AenderungNachname');
    expect(spectator.service.transactionType()).toEqual('AenderungNachname');
    spectator.service.selectTransaction('Kuendigung');
    expect(spectator.service.transactionType()).toEqual('Kuendigung');
  });

  it('should getContract successfully', () => {
    const contract$ = new AsyncSubject<Contract>();
    spectator.inject(ContractService).getContract.mockReturnValue(contract$);
    spectator.service.getContract('123456789');
  });

  it('should getContract with an error', () => {
    const contract$ = new AsyncSubject<Contract>();
    spectator.inject(ContractService).getContract.mockReturnValue(contract$);
    spectator.service.getContract('123456789');
  });

  it('should updateContract successfully', () => {
    const contract$ = new AsyncSubject<Contract>();
    const contractService = spectator.inject(ContractService);
    const contractOverviewStore = spectator.inject(ContractOverviewStore);

    contractService.updateContract.mockReturnValue(contract$);

    spectator.service.updateContract(mockUpdatedContract);
  });

  it('should updateContract with an error', () => {
    const contract$ = new AsyncSubject<Contract>();
    const contractService = spectator.inject(ContractService);
    const contractOverviewStore = spectator.inject(ContractOverviewStore);

    contractService.updateContract.mockReturnValue(contract$);

    spectator.service.updateContract(mockUpdatedContract);
  });
});

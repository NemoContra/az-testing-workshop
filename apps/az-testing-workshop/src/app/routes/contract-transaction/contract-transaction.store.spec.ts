import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { ContractTransactionStore } from './contract-transaction.store';
import { ContractService } from '../../services/contract.service';
import { AsyncSubject, of } from 'rxjs';
import { mockContracts } from '@az-testing-workshop/shared/util/mock-data';
import { Contract } from '@az-testing-workshop/shared/util/api-models';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { ContractOverviewStore } from '../contract-overview/contract-overview.store';
import { patchState, signalState } from '@ngrx/signals';
import { signal } from '@angular/core';

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
    spectator
      .inject(ContractService)
      .getContract.mockReturnValue(contract$.asObservable());
    spectator.service.getContract('123456789');

    expect(spectator.service.loading()).toEqual(true);
    expect(spectator.service.errorCode()).toEqual(undefined);
    expect(spectator.service.contract()).toEqual(undefined);

    contract$.next(mockContracts[0]);
    contract$.complete();

    expect(spectator.service.loading()).toEqual(false);
    expect(spectator.service.errorCode()).toEqual(undefined);
    expect(spectator.service.contract()).toEqual(mockContracts[0]);
  });

  it('should getContract with an error', () => {
    const contract$ = new AsyncSubject<Contract>();
    spectator
      .inject(ContractService)
      .getContract.mockReturnValue(contract$.asObservable());
    spectator.service.getContract('123456789');

    expect(spectator.service.loading()).toEqual(true);
    expect(spectator.service.errorCode()).toEqual(undefined);
    expect(spectator.service.contract()).toEqual(undefined);

    contract$.error(
      new HttpErrorResponse({ status: HttpStatusCode.InternalServerError })
    );

    expect(spectator.service.loading()).toEqual(false);
    expect(spectator.service.errorCode()).toEqual(500);
    expect(spectator.service.contract()).toEqual(undefined);
  });

  it('should updateContract successfully', () => {
    const contract$ = new AsyncSubject<Contract>();
    const contractService = spectator.inject(ContractService);
    const contractOverviewStore = spectator.inject(ContractOverviewStore);

    Object.assign(contractOverviewStore, {
      updateContracts: jest.fn(),
    });

    contractService.updateContract.mockReturnValue(contract$.asObservable());

    spectator.service.updateContract(mockUpdatedContract);

    expect(spectator.service.loading()).toEqual(true);
    expect(spectator.service.errorCode()).toEqual(undefined);
    expect(spectator.service.contract()).toEqual(undefined);

    contract$.next(mockUpdatedContract);
    contract$.complete();

    expect(contractOverviewStore.updateContracts).toHaveBeenCalledTimes(1);
    expect(contractOverviewStore.updateContracts).toHaveBeenNthCalledWith(
      1,
      mockUpdatedContract
    );

    expect(spectator.service.loading()).toEqual(false);
    expect(spectator.service.errorCode()).toEqual(undefined);
    expect(spectator.service.contract()).toEqual(mockUpdatedContract);
  });

  it('should updateContract with an error', () => {
    const contract$ = new AsyncSubject<Contract>();
    const contractService = spectator.inject(ContractService);
    const contractOverviewStore = spectator.inject(ContractOverviewStore);

    Object.assign(contractOverviewStore, {
      updateContracts: jest.fn(),
    });

    contractService.updateContract.mockReturnValue(contract$.asObservable());

    spectator.service.updateContract(mockUpdatedContract);

    expect(spectator.service.loading()).toEqual(true);
    expect(spectator.service.errorCode()).toEqual(undefined);
    expect(spectator.service.contract()).toEqual(undefined);

    contract$.error(
      new HttpErrorResponse({ status: HttpStatusCode.InternalServerError })
    );

    expect(contractOverviewStore.updateContracts).not.toHaveBeenCalled();

    expect(patchState).toHaveBeenCalledTimes(3);
    expect(patchState).toHaveBeenNthCalledWith(1, expect.anything(), {
      loading: true,
    });
    expect(patchState).toHaveBeenNthCalledWith(2, expect.anything(), {
      errorCode: 500,
    });

    expect(spectator.service.loading()).toEqual(false);
    expect(spectator.service.errorCode()).toEqual(500);
    expect(spectator.service.contract()).toEqual(undefined);
    expect(contractOverviewStore.contracts()).toEqual(mockContracts);
  });
});

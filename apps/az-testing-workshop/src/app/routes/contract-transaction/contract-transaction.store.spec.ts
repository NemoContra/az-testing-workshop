import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { ContractTransactionStore } from './contract-transaction.store';
import { ContractService } from '../../services/contract.service';
import { AsyncSubject, of } from 'rxjs';
import { mockContracts } from '@az-testing-workshop/shared/util/mock-data';
import { Contract } from '@az-testing-workshop/shared/util/api-models';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { optimisticUpdateContracts } from '../../common/optimistic-update-contracts';

jest.mock('../../common/optimistic-update-contracts', () => ({
  optimisticUpdateContracts: jest
    .fn()
    .mockImplementation(
      (contracts: Contract[] | undefined, updatedContract: Contract) =>
        contracts?.map((contract) =>
          contract.id === updatedContract.id ? updatedContract : contract
        )
    ),
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
          getContract: jest.fn().mockResolvedValue(of(mockContracts[0])),
          updateContract: jest.fn().mockResolvedValue(of(mockContracts[0])),
        }),
      },
    ],
  });

  beforeEach(() => (spectator = createService()));

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
    spectator.inject(ContractService).getContract.mockReturnValue(contract$);
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

  it('should updateContract successful', () => {
    const contract$ = new AsyncSubject<Contract>();
    spectator.inject(ContractService).updateContract.mockReturnValue(contract$);
    const updatedContract: Contract = {
      ...mockContracts[0],
      person: {
        firstname: 'Berthold',
        lastname: 'Heisterkamp',
        dateOfBirth: '1961-05-16',
      },
    };
    spectator.service.updateContract(updatedContract);

    expect(spectator.service.loading()).toEqual(true);
    expect(spectator.service.errorCode()).toEqual(undefined);
    expect(spectator.service.contract()).toEqual(undefined);

    contract$.next(updatedContract);
    contract$.complete();

    expect(optimisticUpdateContracts).toMatchInlineSnapshot(`
      [MockFunction] {
        "calls": [
          [
            undefined,
            {
              "contractNumber": "1/2345678/9",
              "id": "123456789",
              "person": {
                "dateOfBirth": "1961-05-16",
                "firstname": "Berthold",
                "lastname": "Heisterkamp",
              },
              "premium": 42.42,
              "start": "2024-01-01",
            },
          ],
        ],
        "results": [
          {
            "type": "return",
            "value": undefined,
          },
        ],
      }
    `);

    expect(spectator.service.loading()).toEqual(false);
    expect(spectator.service.errorCode()).toEqual(undefined);
    expect(spectator.service.contract()).toEqual(mockContracts[0]);
  });
});

import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Contract } from '@az-testing-workshop/shared/util/api-models';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { TransactionsType } from '../../common/transaction-type';
import { ContractService } from '../../services/contract.service';
import { ContractOverviewStore } from '../contract-overview/contract-overview.store';
import { optimisticUpdateContracts } from '../../common/optimistic-update-contracts';

export type ContractTransactionState = {
  contract: Contract | undefined;
  errorCode: number | undefined;
  loading: boolean;
  transactionType: TransactionsType | undefined;
};

export const initialContractTransactionState: ContractTransactionState = {
  contract: undefined,
  errorCode: undefined,
  loading: false,
  transactionType: undefined,
};

export const ContractTransactionStore = signalStore(
  withState(initialContractTransactionState),
  withMethods(
    (
      store,
      contractService = inject(ContractService),
      contractOverviewStore = inject(ContractOverviewStore)
    ) => ({
      selectTransaction: (transactionType: TransactionsType) =>
        patchState(store, { transactionType }),
      getContract: rxMethod<string>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap((id: string) =>
            contractService.getContract(id).pipe(
              tapResponse({
                next: (contract) => patchState(store, { contract }),
                error: ({ status }: HttpErrorResponse) =>
                  patchState(store, { errorCode: status }),
                finalize: () => patchState(store, { loading: false }),
              })
            )
          )
        )
      ),
      updateContract: rxMethod<Contract>(
        pipe(
          tap(() => patchState(store, { loading: true })),
          switchMap((contract) =>
            contractService.updateContract(contract).pipe(
              tapResponse({
                next: (contract) => {
                  patchState(store, { contract });
                  patchState(contractOverviewStore, {
                    contracts: optimisticUpdateContracts(
                      contractOverviewStore.contracts(),
                      contract
                    ),
                  });
                },
                error: ({ status }: HttpErrorResponse) =>
                  patchState(store, { errorCode: status }),
                finalize: () => {
                  patchState(store, { loading: false });
                },
              })
            )
          )
        )
      ),
    })
  )
);

import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Contract } from '@az-testing-workshop/shared/util/api-models';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { TransactionsType } from '../../common/transaction-type';

export type ContractTransactionState = {
  contract: Contract | undefined;
  errorCode: number | undefined;
  loading: boolean;
  transactionType: TransactionsType;
};

export const initialContractTransactionState: ContractTransactionState = {
  contract: undefined,
  errorCode: undefined,
  loading: false,
  transactionType: 'AenderungNachname',
};

export const ContractTransactionStore = signalStore(
  withState(initialContractTransactionState),
  withMethods((store, httpClient = inject(HttpClient)) => ({
    selectTransaction: (transactionType: TransactionsType) =>
      patchState(store, { transactionType }),
    getContract: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap((id: string) =>
          httpClient.get<Contract>(`/api/contracts/${id}`).pipe(
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
          httpClient.put<Contract>(`/api/contracts`, contract).pipe(
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
  }))
);

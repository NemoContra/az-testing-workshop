import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { Contract } from '@az-testing-workshop/shared/util/api-models';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { tapResponse } from '@ngrx/operators';

export type ContractDetailsState = {
  contract: Contract | undefined;
  errorCode: number | undefined;
  loading: boolean;
};

export const initialContractDetailsState: ContractDetailsState = {
  contract: undefined,
  errorCode: undefined,
  loading: false,
};

export const ContractDetailsStore = signalStore(
  withState(initialContractDetailsState),
  withMethods((store, httpClient = inject(HttpClient)) => ({
    getContract: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: false })),
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
  }))
);
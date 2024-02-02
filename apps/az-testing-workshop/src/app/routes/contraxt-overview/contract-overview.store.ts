import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Contract } from '@az-testing-workshop/shared/util/api-models';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, distinctUntilChanged, pipe, switchMap, tap } from 'rxjs';
import { inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { tapResponse } from '@ngrx/operators';

export type ContractOverviewState = {
  contracts: Contract[] | undefined;
  errorCode: number | undefined;
  loading: boolean;
  query: string | undefined;
};

export const initialContractOverviewState: ContractOverviewState = {
  contracts: undefined,
  errorCode: undefined,
  loading: false,
  query: undefined,
};

export const ContractOverviewStore = signalStore(
  withState(initialContractOverviewState),
  withMethods((store, httpClient = inject(HttpClient)) => ({
    setQuery: (query: string) => patchState(store, { query }),
    loadContractOverview: rxMethod<string | void>(
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => patchState(store, { loading: true })),
        switchMap((query) =>
          httpClient
            .get<Contract[]>(
              '/api/contracts',
              query ? { params: { query } } : undefined
            )
            .pipe(
              tapResponse({
                next: (contracts) => patchState(store, { contracts }),
                error: ({ status }: HttpErrorResponse) =>
                  patchState(store, { errorCode: status }),
                finalize: () => patchState(store, { loading: false }),
              })
            )
        )
      )
    ),
  })),
  withHooks(({ loadContractOverview, query }) => ({
    onInit: () => loadContractOverview(query),
  }))
);

import {
  patchState,
  signalStore,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { Contract } from '@az-testing-workshop/shared/util/api-models';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { tapResponse } from '@ngrx/operators';
import { ContractService } from '../../services/contract.service';

export type ContractOverviewState = {
  contracts: Contract[] | undefined;
  errorCode: number | undefined;
  loading: boolean;
  query: string;
};

export const initialContractOverviewState: ContractOverviewState = {
  contracts: undefined,
  errorCode: undefined,
  loading: false,
  query: '',
};

export const ContractOverviewStore = signalStore(
  { providedIn: 'root' },
  withState(initialContractOverviewState),
  withMethods((store, contractService = inject(ContractService)) => ({
    setQuery: (query: string) => patchState(store, { query }),
    getContracts: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap((query) =>
          contractService.getContracts(query).pipe(
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
  withHooks(({ getContracts, query }) => ({
    onInit: () => {
      getContracts(query);
    },
  }))
);

export type ContractOverviewStore = InstanceType<typeof ContractOverviewStore>;

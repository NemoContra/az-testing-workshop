import { createRoutingFactory } from '@ngneat/spectator/jest';
import ContractTransactionComponent from './contract-transaction.component';
import { ContractTransactionStore } from './contract-transaction.store';
import { NxMessageToastService } from '@aposin/ng-aquila/message';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { MockComponent, MockModule } from 'ng-mocks';
import { signal } from '@angular/core';
import { Contract } from '@az-testing-workshop/shared/util/api-models';
import { TransactionsType } from '../../common/transaction-type';
import { mockContracts } from '@az-testing-workshop/shared/util/mock-data';
import { ContractDisplayComponent } from '../../shared/contract-display/contract-display.component';
import { NxDropdownHarness } from '@az-testing-workshop/shared/util/test-harnesses';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Router } from '@angular/router';
import { NxErrorModule } from '@aposin/ng-aquila/base';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { mockComponent } from '@az-testing-workshop/shared/util/test-helpers';

jest.mock('@aposin/ng-aquila/message', () => ({
  ...jest.requireActual('@aposin/ng-aquila/message'),
  NxMessageToastService: class _NxMessageToastService {
    open = jest.fn(() => ({
      afterDismissed: jest.fn(() => jest.requireActual('rxjs').of(null)),
    }));
  },
}));

jest.mock('../../common/get-now-date-string', () => ({
  getNowDateString: jest.fn(() => '2024-01-01'),
}));

const createState = () => ({
  getContract: jest.fn(),
  selectTransaction: jest.fn(),
  updateContract: jest.fn(),
  errorCode: signal<number | undefined>(undefined),
  loading: signal(false),
  contract: signal<Contract | undefined>(undefined),
  transactionType: signal<TransactionsType | undefined>(undefined),
});

describe('ContractTransactionComponent', () => {
  let store: ReturnType<typeof createState>;

  const createComponent = createRoutingFactory({
    component: ContractTransactionComponent,
    routes: [
      {
        path: ':id',
        component: ContractTransactionComponent,
      },
    ],
    providers: [
      NxMessageToastService,
      {
        provide: ContractTransactionStore,
        useFactory: () => (store = createState()),
      },
    ],
    overrideModules: [
      [NxFormfieldModule, { remove: { exports: [NxErrorModule] } }],
    ],
    overrideComponents: [
      [
        ContractTransactionComponent,
        {
          remove: {
            imports: [NxIconModule, ContractDisplayComponent],
            providers: [ContractTransactionStore],
          },
          add: {
            imports: [
              MockModule(NxIconModule),
              MockComponent(ContractDisplayComponent),
              mockComponent({ selector: 'nx-error' }),
            ],
          },
        },
      ],
    ],
    stubsEnabled: false,
  });

  it('should render in loading store', () => {
    const spectator = createComponent();
  });

  it('should render with error', () => {
    const spectator = createComponent();
    store.loading.set(false);
    store.errorCode.set(500);
    spectator.detectChanges();
  });

  it('should render with a contract without transactionType', () => {
    const spectator = createComponent({ props: { id: '123456789' } });
  });

  it('should render with a contract and with transactionType "Vertragskündigung"', async () => {
    const spectator = createComponent({
      queryParams: { transaktion: 'Kuendigung' },
      props: { transaktion: 'Kuendigung' },
    });
  });

  it('should select transactionType "Änderung des Nachnamen"', async () => {
    const spectator = createComponent({ props: { id: '123456789' } });
    const router = spectator.inject(Router);
    jest.spyOn(router, 'navigate');
  });

  it('should select transactionType "Kündigen"', async () => {
    const spectator = createComponent();
    const router = spectator.inject(Router);
    jest.spyOn(router, 'navigate');
  });

  it('should submit transactionType "Änderung des Nachnamen"', async () => {
    const spectator = createComponent();
    const nxMessageToastService = spectator.inject(NxMessageToastService);
  });

  it('should submit transactionType "Vertragskündigung"', async () => {
    const spectator = createComponent({
      props: {
        id: '123456789',
      },
    });
    const nxMessageToastService = spectator.inject(NxMessageToastService);
  });

  it('should show an error message if the contract is cancelled', () => {
    const spectator = createComponent();
  });
});

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
    expect(spectator.fixture).toMatchSnapshot();
  });

  it('should render with error', () => {
    const spectator = createComponent();
    store.loading.set(false);
    store.errorCode.set(500);
    spectator.detectChanges();
    expect(spectator.fixture).toMatchSnapshot();
  });

  it('should render with a contract without transactionType', () => {
    const spectator = createComponent({ props: { id: '123456789' } });

    store.loading.set(false);
    store.contract.set(mockContracts[0]);
    spectator.detectChanges();

    expect(spectator.fixture).toMatchSnapshot();

    expect(store.getContract).toHaveBeenCalledTimes(1);
    expect(store.getContract).toHaveBeenCalledWith('123456789');
    expect(spectator.query(ContractDisplayComponent)?.contract).toEqual(
      mockContracts[0]
    );
  });

  it('should render with a contract and with transactionType "Vertragskündigung"', async () => {
    const spectator = createComponent({
      queryParams: { transaktion: 'Kuendigung' },
      props: { transaktion: 'Kuendigung' },
    });

    store.loading.set(false);
    store.contract.set(mockContracts[0]);
    spectator.detectChanges();

    expect(spectator.fixture).toMatchSnapshot();

    expect(store.selectTransaction).toHaveBeenCalledTimes(1);
    expect(spectator.query(ContractDisplayComponent)?.contract).toEqual(
      mockContracts[0]
    );
  });

  it('should select transactionType "Änderung des Nachnamen"', async () => {
    const spectator = createComponent({ props: { id: '123456789' } });
    const router = spectator.inject(Router);
    jest.spyOn(router, 'navigate');

    store.loading.set(false);
    store.contract.set(mockContracts[0]);
    spectator.detectChanges();

    expect(spectator.query(ContractDisplayComponent)?.contract).toEqual(
      mockContracts[0]
    );

    const loader = TestbedHarnessEnvironment.loader(spectator.fixture);
    const dropdownHarness = await loader.getHarness(NxDropdownHarness);

    expect(await dropdownHarness.getText()).toEqual('Bitte wählen');
    await dropdownHarness.clickItem({ text: 'Änderung des Nachnamen' });

    expect(router.navigate).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledWith([], {
      queryParams: {
        transaktion: 'AenderungNachname' satisfies TransactionsType,
      },
    });
  });

  it('should select transactionType "Kündigen"', async () => {
    const spectator = createComponent();
    const router = spectator.inject(Router);
    jest.spyOn(router, 'navigate');

    store.loading.set(false);
    store.contract.set(mockContracts[0]);
    spectator.detectChanges();

    expect(spectator.query(ContractDisplayComponent)?.contract).toEqual(
      mockContracts[0]
    );

    const loader = TestbedHarnessEnvironment.loader(spectator.fixture);
    const dropdownHarness = await loader.getHarness(NxDropdownHarness);

    expect(await dropdownHarness.getText()).toEqual('Bitte wählen');
    await dropdownHarness.clickItem({ text: 'Vertragskündigung' });

    expect(router.navigate).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledWith([], {
      queryParams: {
        transaktion: 'Kuendigung' satisfies TransactionsType,
      },
    });
  });

  it('should submit transactionType "Änderung des Nachnamen"', async () => {
    const spectator = createComponent();
    const nxMessageToastService = spectator.inject(NxMessageToastService);

    store.loading.set(false);
    store.contract.set(mockContracts[0]);
    store.transactionType.set('AenderungNachname');
    spectator.detectChanges();

    spectator.typeInElement('Heisterkamp', 'input[data-testid="nachname"]');
    spectator.click('button[type="submit"]');

    expect(store.updateContract).toHaveBeenCalledTimes(1);
    expect(store.updateContract).toHaveBeenCalledWith({
      contractNumber: '1/2345678/9',
      id: '123456789',
      person: {
        dateOfBirth: '1961-05-16',
        firstname: 'Homer',
        lastname: 'Heisterkamp',
      },
      premium: 42.42,
      start: '2024-01-01',
    });

    expect(nxMessageToastService.open).toHaveBeenCalledTimes(1);
    expect(nxMessageToastService.open).toHaveBeenCalledWith(
      'Änderung des Nachname erfolgreich durchgeführt',
      {
        context: 'success',
        duration: 5000,
      }
    );
  });

  it('should submit transactionType "Vertragskündigung"', async () => {
    const spectator = createComponent({
      props: {
        id: '123456789',
      },
    });
    const nxMessageToastService = spectator.inject(NxMessageToastService);

    store.loading.set(false);
    store.contract.set(mockContracts[0]);
    store.transactionType.set('Kuendigung');
    spectator.detectChanges();

    spectator.click('button[type="submit"]');

    expect(store.updateContract).toHaveBeenCalledTimes(1);
    expect(store.updateContract).toHaveBeenCalledWith({
      contractNumber: '1/2345678/9',
      id: '123456789',
      person: {
        dateOfBirth: '1961-05-16',
        firstname: 'Homer',
        lastname: 'Simpson',
      },
      premium: 42.42,
      start: '2024-01-01',
      end: '2024-01-01',
    });

    expect(nxMessageToastService.open).toHaveBeenCalledTimes(1);
    expect(nxMessageToastService.open).toHaveBeenCalledWith(
      'Kündigung erfolgreich durchgeführt',
      {
        context: 'success',
        duration: 5000,
      }
    );
  });

  it('should show an error message if the contract is cancelled', () => {
    const spectator = createComponent();

    store.loading.set(false);
    store.contract.set({ ...mockContracts[0], end: '2024-01-01' });
    store.transactionType.set('Kuendigung');
    spectator.detectChanges();

    expect(spectator.query('nx-error.cancel-error')).toMatchInlineSnapshot(`
      <nx-error
        class="cancel-error"
      >
        Der Vertrag wurde bereits zum Jan 1, 2024 gekündigt
      </nx-error>
    `);
  });
});

import { createRoutingFactory, SpectatorRouting } from '@ngneat/spectator/jest';
import { LOCALE_ID } from '@angular/core';
import { ContractDisplayComponent } from '../../components/contract-display/contract-display.component';
import { NxLinkModule } from '@aposin/ng-aquila/link';
import { MockComponent, MockModule } from 'ng-mocks';
import { mockContracts } from '@az-testing-workshop/shared/util/mock-data';
import ContractDetailsComponent from './contract-details.component';
import { NxDataDisplayModule } from '@aposin/ng-aquila/data-display';
import { NxErrorComponent, NxErrorModule } from '@aposin/ng-aquila/base';
import { NxSpinnerComponent, NxSpinnerModule } from '@aposin/ng-aquila/spinner';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { ContractService } from '../../services/contract.service';
import { of, throwError } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';

registerLocaleData(localeDe);
describe('ContractDetailsComponent', () => {
  let spectator: SpectatorRouting<ContractDetailsComponent>;

  const createComponent = createRoutingFactory({
    component: ContractDetailsComponent,
    providers: [
      { provide: LOCALE_ID, useValue: 'de-DE' },
      provideHttpClient(),
      provideHttpClientTesting(),
    ],
    overrideComponents: [
      [
        ContractDisplayComponent,
        {
          remove: {
            imports: [
              ContractDisplayComponent,
              NxIconModule,
              NxErrorModule,
              NxDataDisplayModule,
              NxLinkModule,
              NxSpinnerModule,
            ],
          },
          add: {
            imports: [
              MockComponent(ContractDisplayComponent),
              MockModule(NxDataDisplayModule),
              MockModule(NxLinkModule),
              MockModule(NxIconModule),
              MockModule(NxErrorModule),
              MockModule(NxSpinnerModule),
            ],
          },
        },
      ],
    ],
  });

  it('should render content with contract-display component if contractService is returning data successfully', () => {
    spectator = createComponent();

    jest
      .spyOn(spectator.inject(ContractService), 'getContract')
      .mockReturnValue(of(mockContracts[0]));

    spectator.setInput('id', '123456789');

    expect(spectator.inject(ContractService).getContract).toHaveBeenCalledWith(
      '123456789'
    );

    expect(spectator.query(NxSpinnerComponent)).toBeNull();
    expect(spectator.query(NxErrorComponent)).toBeNull();
    expect(spectator.query('div.content contract-display')).not.toBeNull();
    expect(spectator.query(ContractDisplayComponent)?.contract).toEqual(
      mockContracts[0]
    );
  });

  it('should show a loading spinner if data is loading', () => {
    spectator = createComponent();

    jest.spyOn(spectator.inject(ContractService), 'getContract');

    spectator.setInput('id', '123456789');

    expect(spectator.inject(ContractService).getContract).toHaveBeenCalledWith(
      '123456789'
    );

    expect(spectator.query('div.content contract-display')).toBeNull();
    expect(spectator.query(NxErrorComponent)).toBeNull();
    expect(spectator.query(NxSpinnerComponent)).not.toBeNull();
    expect(spectator.query(NxSpinnerComponent)?.size).toEqual('medium');
  });

  it('should show an error if contractService is returning an error ', () => {
    spectator = createComponent();

    jest
      .spyOn(spectator.inject(ContractService), 'getContract')
      .mockReturnValue(throwError(() => ({ status: 500 })));

    spectator.setInput('id', '123456789');

    expect(spectator.inject(ContractService).getContract).toHaveBeenCalledWith(
      '123456789'
    );

    expect(spectator.query('div.content contract-display')).toBeNull();
    expect(spectator.query(NxSpinnerComponent)).toBeNull();
    expect(spectator.query(NxErrorComponent)).not.toBeNull();
    expect(spectator.query('nx-error')?.textContent).toEqual(
      'An error occurred'
    );
  });
});

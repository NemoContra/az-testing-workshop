import { createRoutingFactory, SpectatorRouting } from '@ngneat/spectator/jest';
import { LOCALE_ID } from '@angular/core';
import { ContractDisplayComponent } from '../../shared/contract-display/contract-display.component';
import { NxLinkModule } from '@aposin/ng-aquila/link';
import { MockComponent, MockModule } from 'ng-mocks';
import { mockContracts } from '@az-testing-workshop/shared/util/mock-data';
import ContractDetailsComponent from './contract-details.component';
import { NxDataDisplayModule } from '@aposin/ng-aquila/data-display';
import { NxErrorComponent, NxErrorModule } from '@aposin/ng-aquila/base';
import { NxSpinnerComponent, NxSpinnerModule } from '@aposin/ng-aquila/spinner';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { ContractService } from '../../services/contract.service';
import { NEVER, of, throwError } from 'rxjs';

registerLocaleData(localeDe);

describe('ContractDetailsComponent', () => {
  let spectator: SpectatorRouting<ContractDetailsComponent>;

  const createComponent = createRoutingFactory({
    component: ContractDetailsComponent,
    providers: [
      { provide: LOCALE_ID, useValue: 'de-DE' },
      {
        provide: ContractService,
        useFactory: () => ({
          getContract: jest.fn().mockReturnValue(of(mockContracts[0])),
        }),
      },
    ],
    overrideComponents: [
      [
        ContractDetailsComponent,
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

    spectator.setInput('id', '123456789');
  });

  it('should show a loading spinner if data is loading', () => {
    spectator = createComponent();

    spectator.inject(ContractService).getContract.mockReturnValue(NEVER);

    spectator.setInput('id', '123456789');
  });

  it('should show an error if contractService is returning an error ', () => {
    spectator = createComponent();

    spectator
      .inject(ContractService)
      .getContract.mockReturnValue(throwError(() => ({ status: 500 })));

    spectator.setInput('id', '123456789');
  });
});

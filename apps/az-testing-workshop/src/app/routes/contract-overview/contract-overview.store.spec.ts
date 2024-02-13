import { createServiceFactory } from '@ngneat/spectator/jest';
import { ContractService } from '../../services/contract.service';
import { of, throwError } from 'rxjs';
import { mockContracts } from '@az-testing-workshop/shared/util/mock-data';
import { ContractOverviewStore } from './contract-overview.store';

describe('ContractOverviewStore', () => {
  const createService = createServiceFactory({
    service: ContractOverviewStore,
    providers: [
      {
        provide: ContractService,
        useFactory: () => ({
          getContracts: jest.fn().mockReturnValue(of(mockContracts)),
        }),
      },
    ],
  });

  describe('setQuery', () => {
    it('should return correct state for setting the query', () => {
      const spectator = createService();
    });
  });

  describe('getContracts', () => {
    it('should return correct state for successful call', () => {
      const spectator = createService({
        providers: [
          {
            provide: ContractService,
            useFactory: () => ({
              getContracts: jest.fn().mockReturnValue(of(mockContracts)),
            }),
          },
        ],
      });

      spectator.service.getContracts('123456789');
    });

    it('should return correct state for error', () => {
      const spectator = createService({
        providers: [
          {
            provide: ContractService,
            useFactory: () => ({
              getContracts: jest
                .fn()
                .mockReturnValue(throwError(() => ({ status: 500 }))),
            }),
          },
        ],
      });

      spectator.service.getContracts('123456789');
    });
  });
});

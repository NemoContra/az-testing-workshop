import {
  createServiceFactory,
  type SpectatorService,
} from '@ngneat/spectator/jest';

import { ContractDetailsStore } from './contract-details.store';
import { mockContracts } from '@az-testing-workshop/shared/util/mock-data';
import { ContractService } from '../../services/contract.service';
import { of, throwError } from 'rxjs';
import { MockProvider } from 'ng-mocks';

describe('ContractDetailsStore', () => {
  const createService = createServiceFactory({
    service: ContractDetailsStore,
    providers: [MockProvider(ContractService)],
  });
  let spectator: SpectatorService<ContractDetailsStore>;

  beforeEach(() => (spectator = createService()));

  describe('getContract', () => {
    it('should return correct state for successful call', () => {
      jest
        .spyOn(spectator.inject(ContractService), 'getContract')
        .mockReturnValue(of(mockContracts[0]));

      spectator.service.getContract('123456789');

      expect(
        spectator.inject(ContractService).getContract
      ).toHaveBeenCalledWith('123456789');

      expect(spectator.service.loading()).toEqual(false);
      expect(spectator.service.contract()).toEqual(mockContracts[0]);
      expect(spectator.service.errorCode()).toEqual(undefined);
    });

    it('should return correct state for error', () => {
      jest
        .spyOn(spectator.inject(ContractService), 'getContract')
        .mockReturnValue(throwError(() => ({ status: 500 })));

      spectator.service.getContract('123456789');

      expect(
        spectator.inject(ContractService).getContract
      ).toHaveBeenCalledWith('123456789');

      expect(spectator.service.loading()).toEqual(false);
      expect(spectator.service.contract()).toEqual(undefined);
      expect(spectator.service.errorCode()).toEqual(500);
    });
  });
});

import { createServiceFactory } from '@ngneat/spectator';
import { ContractService } from './contract.service';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { createSpyObserver } from '@az-testing-workshop/test-helpers';

describe('ContractService', () => {
  const createService = createServiceFactory({
    service: ContractService,
    providers: [provideHttpClient(), provideHttpClientTesting()],
  });

  describe('getContracts', () => {
    it('should call the api without query and return successfully', () => {
      const spectator = createService();
      const httpTestingController = spectator.inject(HttpTestingController);
      const spyObserver = createSpyObserver();
      spectator.service.getContracts().subscribe(spyObserver);
    });
  });

  describe('getContract', () => {});

  describe('update', () => {});
});

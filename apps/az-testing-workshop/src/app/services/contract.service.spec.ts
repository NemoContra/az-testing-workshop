import { ContractService } from './contract.service';
import {
  HttpErrorResponse,
  HttpStatusCode,
  provideHttpClient,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { createSpyObserver } from '@az-testing-workshop/shared/util/test-helpers/jest';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { mockContracts } from '@az-testing-workshop/shared/util/mock-data';

describe('ContractService', () => {
  let spectator: SpectatorService<ContractService>;
  let httpTestingController: HttpTestingController;

  const createService = createServiceFactory({
    service: ContractService,
    providers: [provideHttpClient(), provideHttpClientTesting()],
  });

  beforeEach(() => {
    spectator = createService();
    httpTestingController = spectator.inject(HttpTestingController);
  });

  afterEach(() => httpTestingController.verify());

  describe('getContracts', () => {
    it('should call the api without query and return successfully', () => {
      const spyObserver = createSpyObserver();
      spectator.service.getContracts().subscribe(spyObserver);

      const testRequest = httpTestingController.expectOne({
        method: 'GET',
        url: '/api/contracts',
      });
      testRequest.flush(mockContracts);
    });

    it('should call the api with query and return successfully', () => {
      const spyObserver = createSpyObserver();
      spectator.service.getContracts('Bart Simpson').subscribe(spyObserver);
    });

    it('should call the api and return with an error', () => {
      const spyObserver = createSpyObserver();
      spectator.service.getContracts('Bart Simpson').subscribe(spyObserver);
    });
  });

  describe('getContract', () => {
    it('should call the api and return contract successfully', () => {
      const spyObserver = createSpyObserver();
      spectator.service.getContract('123456789').subscribe(spyObserver);
    });

    it('should call the api and return contract with an error', () => {
      const spyObserver = createSpyObserver();
      spectator.service.getContract('123456789').subscribe(spyObserver);
    });
  });

  describe('updateContract', () => {
    it('should call the api and update the contract successfully', () => {
      const spyObserver = createSpyObserver();
      spectator.service.updateContract(mockContracts[0]).subscribe(spyObserver);
    });

    it('should call the api and update the contract with an error', () => {
      const spyObserver = createSpyObserver();
      spectator.service.updateContract(mockContracts[0]).subscribe(spyObserver);
    });
  });
});

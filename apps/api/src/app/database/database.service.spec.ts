import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from './database.service';

describe('DatabaseService', () => {
  let service: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseService],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
  });

  describe('getAllContracts', () => {
    it('should return all contracts', async () => {
      await expect(service.getAllContracts()).resolves.toMatchSnapshot();
    });
  });

  describe('getContractById', () => {
    it('should return contract by id', async () => {
      await expect(service.getContractById('123456789')).resolves.toMatchSnapshot();
    });

    it('should return undefined if id is not existing', async () => {
      await expect(service.getContractById('123')).resolves.toEqual(undefined);
    });
  });

  describe('updateContract', () => {
    it('should return contract by id', async () => {
      await expect(service.updateContract( {
        id: '123456788',
        person: { firstname: 'Bart', lastname: 'Stark', dateOfBirth: '1995-08-21' },
      })).resolves.toMatchSnapshot();
    });

    it('should return undefined if contract to update is not found', async () => {
      await expect(service.updateContract({
        id: '123',
        person: { firstname: 'Bart', lastname: 'Stark', dateOfBirth: '1995-08-21' },
      })).resolves.toEqual(undefined);
    });
  });

});

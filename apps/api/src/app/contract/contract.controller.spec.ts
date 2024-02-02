import { Test, TestingModule } from '@nestjs/testing';
import { ContractController } from './contract.controller';
import { DatabaseService } from '../database/database.service';
import { NestApplication } from '@nestjs/core';
import request from 'supertest';
import { Contract } from '@az-testing-workshop/shared/util/api-models';

describe('ContractController', () => {
  let app: NestApplication;
  let databaseService: DatabaseService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractController],
      providers: [DatabaseService],
    }).compile();

    app = module.createNestApplication();
    databaseService = app.get(DatabaseService);
    await app.init();
  });

  afterAll(() => app.close());

  describe('GET getAllContracts', () => {
    it('should return all contracts', () => {
      jest.spyOn(databaseService, 'getAllContracts').mockResolvedValue([
        {
          id: '123456789',
          contractNumber: '1/2345678/9',
          start: '2024-01-01',
          premium: 42.42,
          person: {
            firstname: 'Homer',
            lastname: 'Simpson',
            dateOfBirth: '1961-05-16',
          },
        },
      ] satisfies Contract[]);

      return request(app.getHttpServer())
        .get('/contracts')
        .expect(200)
        .then(({ body }) => {
          expect(app.get(DatabaseService).getAllContracts).toHaveBeenCalled();
          expect(body).toMatchSnapshot();
        });
    });
  });

  describe('GET getContractById', () => {
    it('should return contract by id', () => {
      jest.spyOn(databaseService, 'getContractById').mockResolvedValue({
        id: '123456789',
        contractNumber: '1/2345678/9',
        start: '2024-01-01',
        premium: 42.42,
        person: {
          firstname: 'Homer',
          lastname: 'Simpson',
          dateOfBirth: '1961-05-16',
        },
      } satisfies Contract);

      return request(app.getHttpServer())
        .get('/contracts/123456789')
        .expect(200)
        .then(({ body }) => {
          expect(app.get(DatabaseService).getContractById).toHaveBeenCalledWith(
            '123456789'
          );
          expect(body).toMatchSnapshot();
        });
    });

    it('should return 404 not found', () => {
      jest
        .spyOn(databaseService, 'getContractById')
        .mockResolvedValue(undefined);

      return request(app.getHttpServer())
        .get('/contracts/123')
        .expect(404)
        .then(({ body }) => {
          expect(app.get(DatabaseService).getContractById).toHaveBeenCalledWith(
            '123'
          );
          expect(body).toMatchSnapshot();
        });
    });
  });

  describe('PUT updateContract', () => {
    it('should update a contract and return the new one', () => {
      jest.spyOn(databaseService, 'updateContract').mockResolvedValue({
        id: '123456789',
        contractNumber: '1/2345678/9',
        start: '2024-01-01',
        premium: 5000,
        person: {
          firstname: 'Homer',
          lastname: 'Stark',
          dateOfBirth: '1961-05-16',
        },
      } satisfies Contract);

      return request(app.getHttpServer())
        .put('/contracts')
        .send({ id: '123456789', premium: 5000 })
        .expect(200)
        .then(({ body }) => {
          expect(app.get(DatabaseService).updateContract).toHaveBeenCalledWith({
            id: '123456789',
            premium: 5000,
          } satisfies Partial<Contract>);
          expect(body).toMatchSnapshot();
        });
    });

    it('should return 404 not found', () => {
      jest
        .spyOn(databaseService, 'updateContract')
        .mockResolvedValue(undefined);

      return request(app.getHttpServer())
        .put('/contracts')
        .send({ id: '123', premium: 5000 })
        .expect(404)
        .then(({ body }) => {
          expect(app.get(DatabaseService).updateContract).toHaveBeenCalledWith({
            id: '123',
            premium: 5000,
          } satisfies Partial<Contract>);
          expect(body).toMatchSnapshot();
        });
    });
  });
});

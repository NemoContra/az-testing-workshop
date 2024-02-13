import { Contract } from '@az-testing-workshop/shared/util/api-models';

export const mockContracts: Contract[] = [
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
  {
    id: '123456788',
    contractNumber: '1/2345678/8',
    start: '2024-02-01',
    premium: 99.0,
    person: {
      firstname: 'Bart',
      lastname: 'Simpson',
      dateOfBirth: '1995-08-21',
    },
  },
];

import { optimisticUpdateContracts } from './optimistic-update-contracts';
import { mockContracts } from '@az-testing-workshop/shared/util/mock-data';

describe('optimisticUpdateContracts', () => {
  it('should update contracts', () => {
    expect(
      optimisticUpdateContracts(mockContracts, {
        ...mockContracts[0],
        contractNumber: '000',
      })
    ).toEqual([
      {
        contractNumber: '000',
        id: '123456789',
        person: {
          dateOfBirth: '1961-05-16',
          firstname: 'Homer',
          lastname: 'Simpson',
        },
        premium: 42.42,
        start: '2024-01-01',
      },
      {
        contractNumber: '1/2345678/8',
        id: '123456788',
        person: {
          dateOfBirth: '1995-08-21',
          firstname: 'Bart',
          lastname: 'Simpson',
        },
        premium: 99,
        start: '2024-02-01',
      },
    ]);
  });

  it('should return undefined if it is called with undefined contracts', () => {
    expect(
      optimisticUpdateContracts(undefined, {
        ...mockContracts[0],
        contractNumber: '000',
      })
    ).toEqual(undefined);
  });
});

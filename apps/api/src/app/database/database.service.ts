import { Injectable } from '@nestjs/common';
import { Contract } from '@az-testing-workshop/shared/util/api-models';

@Injectable()
export class DatabaseService {
  private mockData: Contract[] = [
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

  public getAllContracts(searchQuery?: string): Promise<Contract[]> {
    return Promise.resolve(this.mockData.filter(contract => contract.person.firstname.includes(searchQuery) || contract.person.lastname.includes(searchQuery)));
  }

  public getContractById(contractId: string): Promise<Contract | undefined> {
    return Promise.resolve(this.mockData.find(({ id }) => id === contractId));
  }

  public updateContract(
     updatedContract: Partial<Contract>,
  ): Promise<Contract | undefined> {
    const existingContract = this.mockData.find(
       ({ id }) => id === updatedContract.id,
    );

    if (!existingContract) {
      return Promise.resolve(undefined);
    }

    const updatedContracts = this.mockData.filter(
       ({ id }) => id !== updatedContract.id,
    );

    this.mockData = [
      ...updatedContracts,
      { ...existingContract, ...updatedContract },
    ];

    return Promise.resolve({ ...existingContract, ...updatedContract });
  }
}

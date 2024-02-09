import { Contract } from '@az-testing-workshop/shared/util/api-models';

export const optimisticUpdateContracts = (
  contracts: Contract[] | undefined,
  updatedContract: Contract
) =>
  contracts?.map((contract) =>
    contract.id === updatedContract.id ? updatedContract : contract
  );

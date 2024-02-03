import { Contract } from '@az-testing-workshop/shared/util/api-models';

export const emptyContract: Contract = {
  contractNumber: '',
  id: '',
  start: '',
  end: '',
  premium: 0,
  person: {
    firstname: '',
    lastname: '',
    dateOfBirth: '',
  },
};

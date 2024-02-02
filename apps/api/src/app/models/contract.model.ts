export interface Contract {
  id: string;
  contractNumber: string;
  start: string;
  end?: string;
  premium: number;
  person: Person
}

export interface Person {
  firstname: string;
  lastname: string;
  dateOfBirth: string;
}

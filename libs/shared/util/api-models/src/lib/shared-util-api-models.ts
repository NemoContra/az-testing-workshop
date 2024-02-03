import { z } from 'zod';

export interface Contract {
  id: string;
  contractNumber: string;
  start: string;
  end?: string;
  premium: number;
  person: Person;
}

export interface Person {
  firstname: string;
  lastname: string;
  dateOfBirth: string;
}

export interface Flight {
  from: string;
  to: string;
  time: string;
  delayed: boolean;
}

export const createFlightSchema = z.object({
  from: z.string(),
  to: z.string(),
  time: z.string(),
  delayed: z.boolean()
}).required();

export type CreateFlightDto = z.infer<typeof createFlightSchema>;
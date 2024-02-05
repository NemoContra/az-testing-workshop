import { Observer } from 'rxjs';

export const createSpyObserver = <T>(): Observer<T> => ({
  next: jest.fn(),
  error: jest.fn(),
  complete: jest.fn(),
});

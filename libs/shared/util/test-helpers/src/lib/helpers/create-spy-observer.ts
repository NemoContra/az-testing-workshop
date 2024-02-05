import { Observer } from 'rxjs';

export const createSpyObserver = <T>(): Partial<Observer<T>> => ({
  next: jest.fn(),
  error: jest.fn(),
  complete: jest.fn(),
});

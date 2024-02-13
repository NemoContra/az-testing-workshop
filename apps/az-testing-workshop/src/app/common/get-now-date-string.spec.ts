import { getNowDateString } from './get-now-date-string';

const now = new Date(2024, 0, 1);

describe('getNowDateString', () => {
  beforeAll(() => jest.useFakeTimers({ now }));
  afterAll(() => jest.useRealTimers());

  it('should return date string', () => {
    expect(getNowDateString()).toEqual('2024-01-01');
  });
});

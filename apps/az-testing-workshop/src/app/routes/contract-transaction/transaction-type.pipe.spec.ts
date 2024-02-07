import { createPipeFactory } from '@ngneat/spectator/jest';
import { TransactionTypePipe } from './transaction-type.pipe';
import { TransactionsType } from '../../common/transaction-type';

describe('TransactionTypePipe', () => {
  const createPipe = createPipeFactory(TransactionTypePipe);

  /**
   * We can test pipes using spectator with real template and rendering
   */
  it.each([
    {
      transactionType: 'AenderungNachname' satisfies TransactionsType,
    },
    {
      transactionType: 'Kuendigung' satisfies TransactionsType,
    },
  ])(
    'should render the transactionType for $transactionType',
    ({ transactionType }) => {
      const spectator = createPipe(
        `<span>{{ '${transactionType}' | transactionType }}</span>`
      );
      expect(spectator.fixture).toMatchSnapshot();
    }
  );

  /**
   * We can test pipes by creating an instance manually and calling the transform method
   */
  it.each`
    transactionType                                   | result
    ${'AenderungNachname' satisfies TransactionsType} | ${'Änderung des Nachnamen'}
    ${'Kuendigung' satisfies TransactionsType}        | ${'Vertragskündigung'}
  `(
    'should transform the transactionType for $transactionType',
    ({ transactionType, result }) => {
      const pipe = new TransactionTypePipe();
      expect(pipe.transform(transactionType)).toEqual(result);
    }
  );
});

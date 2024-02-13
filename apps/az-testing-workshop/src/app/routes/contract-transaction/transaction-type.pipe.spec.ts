import { createPipeFactory } from '@ngneat/spectator/jest';
import { TransactionTypePipe } from './transaction-type.pipe';
import { TransactionsType } from '../../common/transaction-type';

describe('TransactionTypePipe', () => {
  const createPipe = createPipeFactory(TransactionTypePipe);

  /**
   * We can test pipes with `createPipeFactory` from spectator
   */
  describe('with spectator', () => {
    it('should render the transactionType for "AenderungNachname"', () => {
      const spectator = createPipe(
        `<span>{{ 'AenderungNachname' | transactionType }}</span>`
      );
    });

    it('should render the transactionType for "Kuendigung"', () => {
      const spectator = createPipe(
        `<span>{{ 'Kuendigung' | transactionType }}</span>`
      );
    });
  });

  /**
   * We can test pipes by creating an instance manually and calling the transform method
   */
  describe('with constructor usage', () => {
    it.each`
      transactionType                                   | result
      ${'AenderungNachname' satisfies TransactionsType} | ${'Änderung des Nachnamen'}
      ${'Kuendigung' satisfies TransactionsType}        | ${'Vertragskündigung'}
    `(
      'should transform the transactionType for $transactionType',
      ({ transactionType, result }) => {
        const pipe = new TransactionTypePipe();
      }
    );
  });
});

import { Pipe, PipeTransform } from '@angular/core';
import { TransactionsType } from '../../common/transaction-type';

const transactionTypeMap = {
  AenderungNachname: 'Änderung des Nachnamen',
  Kuendigung: 'Vertragskündigung',
} as const satisfies Record<TransactionsType, string>;

export const transformTransactionType = <T extends TransactionsType>(
  transactionType: T
) => transactionTypeMap[transactionType];

@Pipe({
  name: 'transactionType',
  standalone: true,
})
export class TransactionTypePipe implements PipeTransform {
  transform = transformTransactionType;
}

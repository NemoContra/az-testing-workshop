export const transactionTypes = ['AenderungNachname', 'Kuendigung'] as const;
export type TransactionsType = (typeof transactionTypes)[number];

export const transactionQueryParamKey = 'transaktion';
export const transactionQueryParam = <T extends TransactionsType>(
  transactionType: T
) =>
  ({
    [transactionQueryParamKey]: transactionType,
  } as const);

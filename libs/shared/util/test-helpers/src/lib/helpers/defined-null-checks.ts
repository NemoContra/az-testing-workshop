export function isNullOrUndefined<T>(
  data: T | null | undefined
): data is null | undefined {
  return data === undefined || data === null || typeof data === 'undefined';
}

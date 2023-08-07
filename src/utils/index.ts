export type MaybePromise<T> = T | Promise<T>;
export type MaybeArray<T> = T | T[];

/**
 * Returns `true` for values other than `null` and `undefined`.
 *
 * @example
 * ```ts
 * const numberArray = numberOrNullArray.filter(isNotNullUndefined);
 * //    ^ number[]    ^ (number | null)[]
 * ```
 */
export function isNotNullOrUndefined<T>(val: T | null | undefined): val is T {
  return val !== null && val !== undefined;
}

/**
 * Returns whether the given `PromiseSettledResult` is a `PromiseRejectedResult`.
 */
export function isPromiseRejectedResult(
  val: PromiseSettledResult<unknown>
): val is PromiseRejectedResult {
  return val.status === 'rejected';
}

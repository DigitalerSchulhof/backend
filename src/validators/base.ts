import { MaybePromise, isPromiseRejectedResult } from '#/utils';
import {
  AggregateInputValidationError,
  InputValidationError,
} from '#/utils/errors';

export abstract class BaseValidator<Base extends object> {
  abstract assertCanCreate(data: Base): Promise<void | never>;

  abstract assertCanUpdate(
    id: string,
    data: Partial<Base>
  ): Promise<void | never>;

  /**
   * Helper expression to throw a validation error.
   */
  protected async throwValidationError(error: string): Promise<never> {
    throw new InputValidationError(error);
  }
}

/**
 * Awaits all given promises and combines all thrown validation errors.
 *
 * @see aggregateValidationErrorsReasons
 */
export async function aggregateValidationErrors(
  promises: Iterable<MaybePromise<unknown> | null>
): Promise<void | never> {
  const results = await Promise.allSettled(promises);

  const errors = results.filter(isPromiseRejectedResult);

  aggregateValidationErrorsReasons(errors);
}

/**
 * Combines an array of promises that rejected with a validation error
 * into a single combined validation error. The combined error is re-thrown.
 *
 * @see AggregateInputValidationError
 */
function aggregateValidationErrorsReasons(
  reasons: PromiseRejectedResult[]
): void | never {
  const errors = reasons.reduce<InputValidationError[]>((arr, acc) => {
    if (acc.reason instanceof InputValidationError) {
      arr.push(acc.reason);
    } else if (acc.reason instanceof AggregateInputValidationError) {
      arr.push(...acc.reason.errors);
    } else {
      throw acc.reason;
    }

    return arr;
  }, []);

  if (errors.length > 0) {
    throw new AggregateInputValidationError(errors);
  }
}

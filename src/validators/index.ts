import { RepositoryInjector } from '#/repositories';
import { Injector, createInjector } from 'typed-inject';
import { AccountValidator } from './account';
import { validatorTokens } from './tokens';

export function createValidatorInjector(
  repositoryInjector: RepositoryInjector
): ValidatorInjector {
  const validatorInjector = repositoryInjector.provideClass(
    validatorTokens.accountValidator,
    AccountValidator
  );

  return createInjector().provideValue(
    validatorTokens.accountValidator,
    validatorInjector.resolve(validatorTokens.accountValidator)
  );
}

export type ValidatorInjector = Injector<{
  [validatorTokens.accountValidator]: AccountValidator;
}>;

import { PermissionHandlerInjector } from '#/permissions';
import { permissionHandlerTokens } from '#/permissions/tokens';
import { RepositoryInjector } from '#/repositories';
import { repositoryTokens } from '#/repositories/tokens';
import { ValidatorInjector } from '#/validators';
import { validatorTokens } from '#/validators/tokens';
import { Injector, createInjector } from 'typed-inject';
import { AccountService } from './account';
import { serviceTokens } from './tokens';

export function createServiceInjector(
  repositoryInjector: RepositoryInjector,
  validatorInjector: ValidatorInjector,
  permissionHandlerInjector: PermissionHandlerInjector
): ServiceInjector {
  return createInjector().provideValue(
    serviceTokens.accountService,
    new AccountService(
      repositoryInjector.resolve(repositoryTokens.accountRepository),
      validatorInjector.resolve(validatorTokens.accountValidator),
      permissionHandlerInjector.resolve(
        permissionHandlerTokens.accountPermissionHandler
      )
    )
  );
}

export type ServiceInjector = Injector<{
  [serviceTokens.accountService]: AccountService;
}>;

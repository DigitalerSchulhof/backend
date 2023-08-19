import { Injector, createInjector } from 'typed-inject';
import { AccountPermissionHandler } from './account';
import { permissionHandlerTokens } from './tokens';

export function createPermissionHandlerInjector(): PermissionHandlerInjector {
  return createInjector().provideClass(
    permissionHandlerTokens.accountPermissionHandler,
    AccountPermissionHandler
  );
}

export type PermissionHandlerInjector = Injector<{
  [permissionHandlerTokens.accountPermissionHandler]: AccountPermissionHandler;
}>;

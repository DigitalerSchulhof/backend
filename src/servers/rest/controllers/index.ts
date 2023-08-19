import { ServiceInjector } from '#/services';
import { Injector, createInjector } from 'typed-inject';
import { RestAccountController } from './account-controller';
import { RestContextManager } from './base';
import { restControllerTokens } from './tokens';

export function createRestControllerInjector(
  serviceInjector: ServiceInjector
): RestControllerInjector {
  const controllerInjector = serviceInjector
    .provideClass('contextManager', RestContextManager)
    .provideClass(
      restControllerTokens.accountController,
      RestAccountController
    );

  const realControllerInjector = createInjector().provideValue(
    restControllerTokens.accountController,
    controllerInjector.resolve(restControllerTokens.accountController)
  );

  return realControllerInjector;
}

export type RestControllerInjector = Injector<{
  [restControllerTokens.accountController]: RestAccountController;
}>;

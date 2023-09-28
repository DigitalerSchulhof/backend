import { IocContainer } from '#/servers/rest/app';
import { RestControllerInjector } from '#/servers/rest/controllers';
import { Injector } from 'typed-inject';

type InjectorConfig = RestControllerInjector extends Injector<infer C>
  ? C
  : never;

export const iocFactory = (
  controllerInjector: RestControllerInjector
): IocContainer => ({
  get: <T extends keyof InjectorConfig>(controller: {
    prototype: unknown;
    key: T;
  }): InjectorConfig[T] => {
    return controllerInjector.resolve(controller.key);
  },
});

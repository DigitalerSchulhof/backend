import { RestControllerInjector } from '#/servers/rest/controllers';
import koa from 'koa';
import type { IocContainerFactory } from 'tsoa';
import { Injector } from 'typed-inject';

type InjectorConfig = RestControllerInjector extends Injector<infer C>
  ? C
  : never;

export const iocContainer = ((req: koa.Request) => ({
  get: <T extends keyof InjectorConfig>(controller: {
    prototype: unknown;
    key: T;
  }): InjectorConfig[T] => {
    return req.ctx.container.resolve(controller.key);
  },
})) satisfies IocContainerFactory<koa.Request>;

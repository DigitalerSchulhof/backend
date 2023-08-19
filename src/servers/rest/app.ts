import { Config } from '#/config';
import {
  RestControllerInjector,
  createRestControllerInjector,
} from '#/servers/rest/controllers';
import { RegisterRoutes } from '#/servers/rest/tsoa/routes';
import { ServiceInjector } from '#/services';
import Router from '@koa/router';
import Koa from 'koa';

declare module 'koa' {
  interface Context {
    container: RestControllerInjector;
  }
}

export function createApp(
  config: Config,
  serviceInjector: ServiceInjector
): { start(): void } {
  const app = new Koa({ proxy: true });

  // TODO: Fix tsoa
  const controllerInjector = createRestControllerInjector(serviceInjector);

  app.context.container = controllerInjector;

  const router = new Router();

  RegisterRoutes(router);

  app.use(router.routes()).use(router.allowedMethods());

  return {
    start() {
      app.listen(config.port);
    },
  };
}

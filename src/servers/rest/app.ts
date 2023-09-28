import { Config } from '#/config';
import { Router } from '@stricjs/router';
import { IocContainer, applyRoutes } from './bttp/router';

export function createApp(
  iocContainer: IocContainer,
  config: Config
): { start(): void } {
  const app = new Router({
    port: config.port,
  }).use(404);

  applyRoutes(iocContainer, app);

  return {
    start() {
      app.fetch;
      app.listen();
    },
  };
}

import { Config } from '#/config';
import Koa from 'koa';

export function createApp(config: Config) {
  const app = new Koa({ proxy: true });
}

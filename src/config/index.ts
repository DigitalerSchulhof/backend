import { Parse, v } from 'vality';
import { loadEnv } from 'vality-env';

/* eslint-disable @typescript-eslint/naming-convention */
const configSchema = {
  appEnv: v.string({
    default: 'local',
  }),
  port: v.number({
    default: 8080,
  }),
} as const;
/* eslint-enable @typescript-eslint/naming-convention */

export type Config = Parse<typeof configSchema>;

function loadConfig(): Config {
  const validatedConfig = loadEnv(configSchema);

  if (!validatedConfig.valid) {
    console.log(validatedConfig.errors);
    throw new Error('Invalid config');
  }

  return validatedConfig.data;
}

export const config = loadConfig();

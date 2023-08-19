import { Parse, v } from 'vality';
import { loadEnv } from 'vality-env';

const configSchema = {
  appEnv: v.string({
    default: 'local',
  }),
  port: v.number({
    default: 4000,
  }),
  database: {
    url: v.string({ default: 'http://localhost:8529' }),
    name: v.string({ default: 'dsh' }),
    username: v.string({ default: 'root' }),
    password: v.string({ default: '' }),
  },
} as const;

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

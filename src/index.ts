import { config } from '#/config';
import { createServer } from '#/server';
import { createCredentials } from '#/server/credentials';

const server = createServer();
const credentials = createCredentials();

server.bindAsync(
  `0.0.0.0:${config.port}`,
  // TODO: TLS support
  credentials,
  (err, port) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    server.start();
    console.log(`Listening on ${port}`);
  }
);

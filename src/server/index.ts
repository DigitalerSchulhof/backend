import * as grpc from '@grpc/grpc-js';

export function createServer(): grpc.Server {
  const server = new grpc.Server();

  return server;
}

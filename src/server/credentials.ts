import * as grpc from '@grpc/grpc-js';

export function createCredentials(): grpc.ServerCredentials {
  return grpc.ServerCredentials.createInsecure();
}

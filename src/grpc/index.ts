import * as grpc from '@grpc/grpc-js';
import { AccountGrpcService } from './account';
import { AccountServiceService } from '@dsh/protocols/dsh/services/account/v1/service_grpc_pb';

export function registerServices(server: grpc.Server): void {
  const services = createServices();

  server.addService(AccountServiceService, services.accountService);
}

function createServices() {
  const accountService = new AccountGrpcService();

  return {
    accountService,
  };
}

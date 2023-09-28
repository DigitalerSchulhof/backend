import { config } from '#/config';
import { createPermissionHandlerInjector } from '#/permissions';
import { createArangoRepositoryInjector } from '#/repositories';
import { createApp } from '#/servers/rest/app';
import { createRestControllerInjector } from '#/servers/rest/controllers';
import { iocFactory } from '#/servers/rest/ioc';
import { createServiceInjector } from '#/services';
import { createValidatorInjector } from '#/validators';

const repositoryInjector = createArangoRepositoryInjector(config);
const validationInjector = createValidatorInjector(repositoryInjector);
const permissionHandlerInjector = createPermissionHandlerInjector();

const serviceInjector = createServiceInjector(
  repositoryInjector,
  validationInjector,
  permissionHandlerInjector
);

const restControllerInjector = createRestControllerInjector(serviceInjector);

const iocContainer = iocFactory(restControllerInjector);

const app = createApp(iocContainer, config);

app.start();

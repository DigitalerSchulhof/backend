import { config } from '#/config';
import { createPermissionHandlerInjector } from '#/permissions';
import { createArangoRepositoryInjector } from '#/repositories';
import { createApp } from '#/servers/rest/app';
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

const app = createApp(config, serviceInjector);

app.start();

import { config } from '#/config';
import { createPermissionHandlers } from '#/permissions';
import { createArangoRepositories } from '#/repositories/arango';
import { createApp } from '#/servers/rest/app';
import { createRestControllers } from '#/servers/rest/controllers';
import { iocFactory } from '#/servers/rest/ioc';
import { createServices } from '#/services';
import { createValidators } from '#/validators';

const repositories = createArangoRepositories(config);
const validators = createValidators(repositories);
const permissionHandlers = createPermissionHandlers();

const services = createServices(repositories, validators, permissionHandlers);

const restControllerInjector = createRestControllers(services);

const iocContainer = iocFactory(restControllerInjector);

const app = createApp(iocContainer, config);

app.start();

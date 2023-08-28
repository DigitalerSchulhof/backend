import { PermissionHandlerInjector } from '#/permissions';
import { permissionHandlerTokens } from '#/permissions/tokens';
import { RepositoryInjector } from '#/repositories';
import { repositoryTokens } from '#/repositories/tokens';
import { ValidatorInjector } from '#/validators';
import { validatorTokens } from '#/validators/tokens';
import { Injector, createInjector } from 'typed-inject';
import { AccountService } from './account';
import { serviceTokens } from './tokens';
import { ClassService } from '#/services/class';
import { CourseService } from '#/services/course';
import { IdentityTheftService } from '#/services/identity-theft';
import { LevelService } from '#/services/level';
import { PersonService } from '#/services/person';
import { SchoolyearService } from '#/services/schoolyear';
import { SessionService } from '#/services/session';

export function createServiceInjector(
  repositoryInjector: RepositoryInjector,
  validatorInjector: ValidatorInjector,
  permissionHandlerInjector: PermissionHandlerInjector
): ServiceInjector {
  return createInjector()
    .provideValue(
      serviceTokens.accountService,
      new AccountService(
        repositoryInjector.resolve(repositoryTokens.accountRepository),
        validatorInjector.resolve(validatorTokens.accountValidator),
        permissionHandlerInjector.resolve(
          permissionHandlerTokens.accountPermissionHandler
        )
      )
    )
    .provideValue(
      serviceTokens.classService,
      new ClassService(
        repositoryInjector.resolve(repositoryTokens.classRepository),
        validatorInjector.resolve(validatorTokens.classValidator),
        permissionHandlerInjector.resolve(
          permissionHandlerTokens.classPermissionHandler
        )
      )
    )
    .provideValue(
      serviceTokens.courseService,
      new CourseService(
        repositoryInjector.resolve(repositoryTokens.courseRepository),
        validatorInjector.resolve(validatorTokens.courseValidator),
        permissionHandlerInjector.resolve(
          permissionHandlerTokens.coursePermissionHandler
        )
      )
    )
    .provideValue(
      serviceTokens.identityTheftService,
      new IdentityTheftService(
        repositoryInjector.resolve(repositoryTokens.identityTheftRepository),
        validatorInjector.resolve(validatorTokens.identityTheftValidator),
        permissionHandlerInjector.resolve(
          permissionHandlerTokens.identityTheftPermissionHandler
        )
      )
    )
    .provideValue(
      serviceTokens.levelService,
      new LevelService(
        repositoryInjector.resolve(repositoryTokens.levelRepository),
        validatorInjector.resolve(validatorTokens.levelValidator),
        permissionHandlerInjector.resolve(
          permissionHandlerTokens.levelPermissionHandler
        )
      )
    )
    .provideValue(
      serviceTokens.personService,
      new PersonService(
        repositoryInjector.resolve(repositoryTokens.personRepository),
        validatorInjector.resolve(validatorTokens.personValidator),
        permissionHandlerInjector.resolve(
          permissionHandlerTokens.personPermissionHandler
        )
      )
    )
    .provideValue(
      serviceTokens.schoolyearService,
      new SchoolyearService(
        repositoryInjector.resolve(repositoryTokens.schoolyearRepository),
        validatorInjector.resolve(validatorTokens.schoolyearValidator),
        permissionHandlerInjector.resolve(
          permissionHandlerTokens.schoolyearPermissionHandler
        )
      )
    )
    .provideValue(
      serviceTokens.sessionService,
      new SessionService(
        repositoryInjector.resolve(repositoryTokens.sessionRepository),
        validatorInjector.resolve(validatorTokens.sessionValidator),
        permissionHandlerInjector.resolve(
          permissionHandlerTokens.sessionPermissionHandler
        )
      )
    );
}

export type ServiceInjector = Injector<{
  [serviceTokens.accountService]: AccountService;
  [serviceTokens.classService]: ClassService;
  [serviceTokens.courseService]: CourseService;
  [serviceTokens.identityTheftService]: IdentityTheftService;
  [serviceTokens.levelService]: LevelService;
  [serviceTokens.personService]: PersonService;
  [serviceTokens.schoolyearService]: SchoolyearService;
  [serviceTokens.sessionService]: SessionService;
}>;

import { Injector, createInjector } from 'typed-inject';
import { AccountPermissionHandler } from './account';
import { ClassPermissionHandler } from './class';
import { CoursePermissionHandler } from './course';
import { IdentityTheftPermissionHandler } from './identity-theft';
import { LevelPermissionHandler } from './level';
import { PersonPermissionHandler } from './person';
import { SchoolyearPermissionHandler } from './schoolyear';
import { SessionPermissionHandler } from './session';
import { permissionHandlerTokens } from './tokens';

export function createPermissionHandlerInjector(): PermissionHandlerInjector {
  return createInjector()
    .provideClass(
      permissionHandlerTokens.accountPermissionHandler,
      AccountPermissionHandler
    )
    .provideClass(
      permissionHandlerTokens.classPermissionHandler,
      ClassPermissionHandler
    )
    .provideClass(
      permissionHandlerTokens.coursePermissionHandler,
      CoursePermissionHandler
    )
    .provideClass(
      permissionHandlerTokens.identityTheftPermissionHandler,
      IdentityTheftPermissionHandler
    )
    .provideClass(
      permissionHandlerTokens.levelPermissionHandler,
      LevelPermissionHandler
    )
    .provideClass(
      permissionHandlerTokens.personPermissionHandler,
      PersonPermissionHandler
    )
    .provideClass(
      permissionHandlerTokens.schoolyearPermissionHandler,
      SchoolyearPermissionHandler
    )
    .provideClass(
      permissionHandlerTokens.sessionPermissionHandler,
      SessionPermissionHandler
    );
}

export type PermissionHandlerInjector = Injector<{
  [permissionHandlerTokens.accountPermissionHandler]: AccountPermissionHandler;
  [permissionHandlerTokens.classPermissionHandler]: ClassPermissionHandler;
  [permissionHandlerTokens.coursePermissionHandler]: CoursePermissionHandler;
  [permissionHandlerTokens.identityTheftPermissionHandler]: IdentityTheftPermissionHandler;
  [permissionHandlerTokens.levelPermissionHandler]: LevelPermissionHandler;
  [permissionHandlerTokens.personPermissionHandler]: PersonPermissionHandler;
  [permissionHandlerTokens.schoolyearPermissionHandler]: SchoolyearPermissionHandler;
  [permissionHandlerTokens.sessionPermissionHandler]: SessionPermissionHandler;
}>;

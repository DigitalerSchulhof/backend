import { AccountPermissionHandler } from './account';
import { ClassPermissionHandler } from './class';
import { CoursePermissionHandler } from './course';
import { IdentityTheftPermissionHandler } from './identity-theft';
import { LevelPermissionHandler } from './level';
import { PersonPermissionHandler } from './person';
import { SchoolyearPermissionHandler } from './schoolyear';
import { SessionPermissionHandler } from './session';

export function createPermissionHandlers(): PermissionHandlers {
  return {
    accountPermissionHandler: new AccountPermissionHandler(),
    classPermissionHandler: new ClassPermissionHandler(),
    coursePermissionHandler: new CoursePermissionHandler(),
    identityTheftPermissionHandler: new IdentityTheftPermissionHandler(),
    levelPermissionHandler: new LevelPermissionHandler(),
    personPermissionHandler: new PersonPermissionHandler(),
    schoolyearPermissionHandler: new SchoolyearPermissionHandler(),
    sessionPermissionHandler: new SessionPermissionHandler(),
  };
}

export type PermissionHandlers = {
  accountPermissionHandler: AccountPermissionHandler;
  classPermissionHandler: ClassPermissionHandler;
  coursePermissionHandler: CoursePermissionHandler;
  identityTheftPermissionHandler: IdentityTheftPermissionHandler;
  levelPermissionHandler: LevelPermissionHandler;
  personPermissionHandler: PersonPermissionHandler;
  schoolyearPermissionHandler: SchoolyearPermissionHandler;
  sessionPermissionHandler: SessionPermissionHandler;
};

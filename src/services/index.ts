import { PermissionHandlers } from '#/permissions';
import { Repositories } from '#/repositories';
import { Validators } from '#/validators';
import { AccountService } from './account';
import { ClassService } from './class';
import { CourseService } from './course';
import { IdentityTheftService } from './identity-theft';
import { LevelService } from './level';
import { PersonService } from './person';
import { SchoolyearService } from './schoolyear';
import { SessionService } from './session';

export function createServices(
  repositories: Repositories,
  validators: Validators,
  permissionHandlers: PermissionHandlers
): Services {
  return {
    accountService: new AccountService(
      repositories.accountRepository,
      validators.accountValidator,
      permissionHandlers.accountPermissionHandler
    ),
    classService: new ClassService(
      repositories.classRepository,
      validators.classValidator,
      permissionHandlers.classPermissionHandler
    ),
    courseService: new CourseService(
      repositories.courseRepository,
      validators.courseValidator,
      permissionHandlers.coursePermissionHandler
    ),
    identityTheftService: new IdentityTheftService(
      repositories.identityTheftRepository,
      validators.identityTheftValidator,
      permissionHandlers.identityTheftPermissionHandler
    ),
    levelService: new LevelService(
      repositories.levelRepository,
      validators.levelValidator,
      permissionHandlers.levelPermissionHandler
    ),
    personService: new PersonService(
      repositories.personRepository,
      validators.personValidator,
      permissionHandlers.personPermissionHandler
    ),
    schoolyearService: new SchoolyearService(
      repositories.schoolyearRepository,
      validators.schoolyearValidator,
      permissionHandlers.schoolyearPermissionHandler
    ),
    sessionService: new SessionService(
      repositories.sessionRepository,
      validators.sessionValidator,
      permissionHandlers.sessionPermissionHandler
    ),
  };
}

export type Services = {
  accountService: AccountService;
  classService: ClassService;
  courseService: CourseService;
  identityTheftService: IdentityTheftService;
  levelService: LevelService;
  personService: PersonService;
  schoolyearService: SchoolyearService;
  sessionService: SessionService;
};

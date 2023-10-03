import { Repositories } from '#/repositories';
import { AccountValidator } from './account';
import { ClassValidator } from './class';
import { CourseValidator } from './course';
import { IdentityTheftValidator } from './identity-theft';
import { LevelValidator } from './level';
import { PersonValidator } from './person';
import { SchoolyearValidator } from './schoolyear';
import { SessionValidator } from './session';

export function createValidators(repositories: Repositories): Validators {
  return {
    accountValidator: new AccountValidator(
      repositories.accountRepository,
      repositories.personRepository
    ),
    classValidator: new ClassValidator(
      repositories.classRepository,
      repositories.levelRepository
    ),
    courseValidator: new CourseValidator(
      repositories.courseRepository,
      repositories.classRepository
    ),
    identityTheftValidator: new IdentityTheftValidator(
      repositories.identityTheftRepository,
      repositories.personRepository
    ),
    levelValidator: new LevelValidator(
      repositories.levelRepository,
      repositories.schoolyearRepository
    ),
    personValidator: new PersonValidator(repositories.personRepository),
    schoolyearValidator: new SchoolyearValidator(
      repositories.schoolyearRepository
    ),
    sessionValidator: new SessionValidator(
      repositories.sessionRepository,
      repositories.accountRepository
    ),
  };
}

export type Validators = {
  accountValidator: AccountValidator;
  classValidator: ClassValidator;
  courseValidator: CourseValidator;
  identityTheftValidator: IdentityTheftValidator;
  levelValidator: LevelValidator;
  personValidator: PersonValidator;
  schoolyearValidator: SchoolyearValidator;
  sessionValidator: SessionValidator;
};

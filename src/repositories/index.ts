import { Injector } from 'typed-inject';
import { AccountRepository } from './interfaces/account';
import { ClassRepository } from './interfaces/class';
import { CourseRepository } from './interfaces/course';
import { IdentityTheftRepository } from './interfaces/identity-theft';
import { LevelRepository } from './interfaces/level';
import { PersonRepository } from './interfaces/person';
import { SchoolyearRepository } from './interfaces/schoolyear';
import { SessionRepository } from './interfaces/session';
import { repositoryTokens } from './tokens';

export { createArangoRepositoryInjector } from './arango';

export type RepositoryInjector = Injector<{
  [repositoryTokens.accountRepository]: AccountRepository;
  [repositoryTokens.classRepository]: ClassRepository;
  [repositoryTokens.courseRepository]: CourseRepository;
  [repositoryTokens.identityTheftRepository]: IdentityTheftRepository;
  [repositoryTokens.levelRepository]: LevelRepository;
  [repositoryTokens.personRepository]: PersonRepository;
  [repositoryTokens.schoolyearRepository]: SchoolyearRepository;
  [repositoryTokens.sessionRepository]: SessionRepository;
}>;

import { AccountRepository } from './interfaces/account';
import { ClassRepository } from './interfaces/class';
import { CourseRepository } from './interfaces/course';
import { IdentityTheftRepository } from './interfaces/identity-theft';
import { LevelRepository } from './interfaces/level';
import { PersonRepository } from './interfaces/person';
import { SchoolyearRepository } from './interfaces/schoolyear';
import { SessionRepository } from './interfaces/session';

export type Repositories = {
  accountRepository: AccountRepository;
  classRepository: ClassRepository;
  courseRepository: CourseRepository;
  identityTheftRepository: IdentityTheftRepository;
  levelRepository: LevelRepository;
  personRepository: PersonRepository;
  schoolyearRepository: SchoolyearRepository;
  sessionRepository: SessionRepository;
};

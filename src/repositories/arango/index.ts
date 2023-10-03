import { Config } from '#/config';
import { Repositories } from '#/repositories';
import { Database } from 'arangojs';
import { ArangoAccountRepositoryAdapter } from './adapters/account';
import { ArangoClassRepositoryAdapter } from './adapters/class';
import { ArangoCourseRepositoryAdapter } from './adapters/course';
import { ArangoIdentityTheftRepositoryAdapter } from './adapters/identity-theft';
import { ArangoLevelRepositoryAdapter } from './adapters/level';
import { ArangoPersonRepositoryAdapter } from './adapters/person';
import { ArangoSchoolyearRepositoryAdapter } from './adapters/schoolyear';
import { ArangoSessionRepositoryAdapter } from './adapters/session';
import { ArangoAccountRepository } from './repositories/account';
import { ArangoClassRepository } from './repositories/class';
import { ArangoCourseRepository } from './repositories/course';
import { ArangoIdentityTheftRepository } from './repositories/identity-theft';
import { ArangoLevelRepository } from './repositories/level';
import { ArangoPersonRepository } from './repositories/person';
import { ArangoSchoolyearRepository } from './repositories/schoolyear';
import { ArangoSessionRepository } from './repositories/session';

export function createArangoRepositoryInjector(config: Config): Repositories {
  const db = new Database({
    databaseName: config.database.name,
    url: config.database.url,
    auth: {
      username: config.database.username,
      password: config.database.password,
    },
  });

  return {
    accountRepository: new ArangoAccountRepositoryAdapter(
      new ArangoAccountRepository(db)
    ),
    classRepository: new ArangoClassRepositoryAdapter(
      new ArangoClassRepository(db)
    ),
    courseRepository: new ArangoCourseRepositoryAdapter(
      new ArangoCourseRepository(db)
    ),
    identityTheftRepository: new ArangoIdentityTheftRepositoryAdapter(
      new ArangoIdentityTheftRepository(db)
    ),
    levelRepository: new ArangoLevelRepositoryAdapter(
      new ArangoLevelRepository(db)
    ),
    personRepository: new ArangoPersonRepositoryAdapter(
      new ArangoPersonRepository(db)
    ),
    schoolyearRepository: new ArangoSchoolyearRepositoryAdapter(
      new ArangoSchoolyearRepository(db)
    ),
    sessionRepository: new ArangoSessionRepositoryAdapter(
      new ArangoSessionRepository(db)
    ),
  };
}

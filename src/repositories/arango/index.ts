import { Config } from '#/config';
import { RepositoryInjector } from '#/repositories';
import { repositoryTokens } from '#/repositories/tokens';
import { Database } from 'arangojs';
import { createInjector } from 'typed-inject';
import { ArangoAccountRepositoryAdapter } from './adapters/account';
import { ArangoClassRepositoryAdapter } from './adapters/class';
import { ArangoCourseRepositoryAdapter } from './adapters/course';
import { ArangoIdentityTheftRepositoryAdapter } from './adapters/identity-theft';
import { ArangoLevelRepositoryAdapter } from './adapters/level';
import { ArangoPersonRepositoryAdapter } from './adapters/person';
import { ArangoSchoolyearRepositoryAdapter } from './adapters/schoolyear';
import { ArangoSessionRepositoryAdapter } from './adapters/session';
import { ArangoAccountRepository } from './services/account';
import { ArangoClassRepository } from './services/class';
import { ArangoCourseRepository } from './services/course';
import { ArangoIdentityTheftRepository } from './services/identity-theft';
import { ArangoLevelRepository } from './services/level';
import { ArangoPersonRepository } from './services/person';
import { ArangoSchoolyearRepository } from './services/schoolyear';
import { ArangoSessionRepository } from './services/session';
import { arangoRepositoryTokens } from './tokens';

export function createArangoRepositoryInjector(
  config: Config
): RepositoryInjector {
  const db = new Database({
    databaseName: config.database.name,
    url: config.database.url,
    auth: {
      username: config.database.username,
      password: config.database.password,
    },
  });

  const databaseInjector = createInjector().provideValue('database', db);

  const arangoInjector = databaseInjector
    .provideClass(
      arangoRepositoryTokens.accountRepository,
      ArangoAccountRepository
    )
    .provideClass(
      arangoRepositoryTokens.accountRepositoryAdapter,
      ArangoAccountRepositoryAdapter
    )
    .provideClass(arangoRepositoryTokens.classRepository, ArangoClassRepository)
    .provideClass(
      arangoRepositoryTokens.classRepositoryAdapter,
      ArangoClassRepositoryAdapter
    )
    .provideClass(
      arangoRepositoryTokens.courseRepository,
      ArangoCourseRepository
    )
    .provideClass(
      arangoRepositoryTokens.courseRepositoryAdapter,
      ArangoCourseRepositoryAdapter
    )
    .provideClass(
      arangoRepositoryTokens.identityTheftRepository,
      ArangoIdentityTheftRepository
    )
    .provideClass(
      arangoRepositoryTokens.identityTheftRepositoryAdapter,
      ArangoIdentityTheftRepositoryAdapter
    )
    .provideClass(arangoRepositoryTokens.levelRepository, ArangoLevelRepository)
    .provideClass(
      arangoRepositoryTokens.levelRepositoryAdapter,
      ArangoLevelRepositoryAdapter
    )
    .provideClass(
      arangoRepositoryTokens.personRepository,
      ArangoPersonRepository
    )
    .provideClass(
      arangoRepositoryTokens.personRepositoryAdapter,
      ArangoPersonRepositoryAdapter
    )
    .provideClass(
      arangoRepositoryTokens.schoolyearRepository,
      ArangoSchoolyearRepository
    )
    .provideClass(
      arangoRepositoryTokens.schoolyearRepositoryAdapter,
      ArangoSchoolyearRepositoryAdapter
    )
    .provideClass(
      arangoRepositoryTokens.sessionRepository,
      ArangoSessionRepository
    )
    .provideClass(
      arangoRepositoryTokens.sessionRepositoryAdapter,
      ArangoSessionRepositoryAdapter
    );

  const realArangoInjector = createInjector()
    .provideValue(
      repositoryTokens.accountRepository,
      arangoInjector.resolve(arangoRepositoryTokens.accountRepositoryAdapter)
    )
    .provideValue(
      repositoryTokens.classRepository,
      arangoInjector.resolve(arangoRepositoryTokens.classRepositoryAdapter)
    )
    .provideValue(
      repositoryTokens.courseRepository,
      arangoInjector.resolve(arangoRepositoryTokens.courseRepositoryAdapter)
    )
    .provideValue(
      repositoryTokens.identityTheftRepository,
      arangoInjector.resolve(
        arangoRepositoryTokens.identityTheftRepositoryAdapter
      )
    )
    .provideValue(
      repositoryTokens.levelRepository,
      arangoInjector.resolve(arangoRepositoryTokens.levelRepositoryAdapter)
    )
    .provideValue(
      repositoryTokens.personRepository,
      arangoInjector.resolve(arangoRepositoryTokens.personRepositoryAdapter)
    )
    .provideValue(
      repositoryTokens.schoolyearRepository,
      arangoInjector.resolve(arangoRepositoryTokens.schoolyearRepositoryAdapter)
    )
    .provideValue(
      repositoryTokens.sessionRepository,
      arangoInjector.resolve(arangoRepositoryTokens.sessionRepositoryAdapter)
    );

  return realArangoInjector;
}

import { Config } from '#/config';
import { RepositoryInjector } from '#/repositories';
import { ArangoAccountRepositoryAdapter } from '#/repositories/arango/adapters/accounts';
import { ArangoAccountRepository } from '#/repositories/arango/services/account';
import { arangoRepositoryTokens } from '#/repositories/arango/tokens';
import { repositoryTokens } from '#/repositories/tokens';
import { Database } from 'arangojs';
import { createInjector } from 'typed-inject';

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
    );

  const realArangoInjector = createInjector().provideValue(
    repositoryTokens.accountRepository,
    arangoInjector.resolve(arangoRepositoryTokens.accountRepositoryAdapter)
  );

  return realArangoInjector;
}

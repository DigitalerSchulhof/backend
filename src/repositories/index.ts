import { Injector } from 'typed-inject';
import { AccountRepository } from './interfaces/account';
import { repositoryTokens } from './tokens';

export { createArangoRepositoryInjector } from './arango';

export type RepositoryInjector = Injector<{
  [repositoryTokens.accountRepository]: AccountRepository;
}>;

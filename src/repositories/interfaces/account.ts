import { Account } from '#/services/account';
import { WithId } from '#/services/base';
import type { BaseRepository } from './base';

export interface AccountRepository extends BaseRepository<Account> {
  create(
    data: Account,
    options?: {
      /**
       * Only creates the account if the person has the given rev.
       */
      ifPersonRev?: string;
    }
  ): Promise<WithId<Account>>;
}

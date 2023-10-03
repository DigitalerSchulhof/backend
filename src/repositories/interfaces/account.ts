import { Account } from '#/models/account';
import { WithId } from '#/models/base';
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

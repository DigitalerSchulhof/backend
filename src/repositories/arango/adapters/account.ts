import { AccountRepository } from '#/repositories/interfaces/account';
import * as js from '#/services/account';
import { ListResult, SearchOptions, TypeFilter, WithId } from '#/services/base';
import { tokens } from 'typed-inject';
import {
  accountFilterToArango,
  accountFromArango,
  accountToArango,
} from '../converters/account';
import { ArangoAccountRepository } from '../services/account';
import { arangoRepositoryTokens } from '../tokens';

export class ArangoAccountRepositoryAdapter implements AccountRepository {
  constructor(private readonly repository: ArangoAccountRepository) {}

  static readonly inject = tokens(arangoRepositoryTokens.accountRepository);

  async search(
    options: SearchOptions<js.Account>
  ): Promise<ListResult<WithId<js.Account>>> {
    const res = await this.repository.search({
      limit: options.limit,
      offset: options.offset,
      filter:
        options.filter === undefined
          ? undefined
          : accountFilterToArango(options.filter),
      order: options.order,
    });

    return {
      items: res.items.map((r) => accountFromArango(r)),
      total: res.total,
    };
  }

  async get(ids: readonly string[]): Promise<(WithId<js.Account> | null)[]> {
    const res = await this.repository.get(ids);

    return res.map((r) => (r === null ? null : accountFromArango(r)));
  }

  // TODO: Person Rev
  async create(
    data: js.Account,
    options?: {
      ifPersonRev?: string;
    }
  ): Promise<WithId<js.Account>> {
    const res = await this.repository.create(accountToArango(data));

    return accountFromArango(res);
  }

  async update(
    id: string,
    data: Partial<js.Account>,
    options?: { ifRev?: string }
  ): Promise<WithId<js.Account>> {
    const res = await this.repository.update(
      id,
      accountToArango(data),
      options?.ifRev
    );

    return accountFromArango(res);
  }

  async updateWhere(
    filter: TypeFilter<js.Account>,
    data: Partial<js.Account>
  ): Promise<number> {
    const res = await this.repository.updateWhere(
      accountFilterToArango(filter),
      accountToArango(data)
    );

    return res;
  }

  async delete(
    id: string,
    options?: { ifRev?: string }
  ): Promise<WithId<js.Account>> {
    const res = await this.repository.delete(id, options?.ifRev);

    return accountFromArango(res);
  }

  async deleteWhere(filter: TypeFilter<js.Account>): Promise<number> {
    const res = await this.repository.deleteWhere(
      accountFilterToArango(filter)
    );

    return res;
  }
}

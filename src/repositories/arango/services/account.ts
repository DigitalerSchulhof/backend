import * as js from '#/interfaces/account';
import { AccountRepository } from '#/interfaces/account';
import { ListResult, SearchOptions, WithId } from '#/repositories/interfaces/base';
import {
  accountFromJs,
  accountToJs,
} from '#/repositories/arango/converters/account';
import { ArangoRepository } from './base';

export type Account = {
  personId: string;
  username: string;
  email: string;
  password: string;
  salt: string;
  passwordExpiresAt: number | null;
  lastLogin: number | null;
  secondLastLogin: number | null;
  settings: AccountSettings;
};

export type AccountSettings = {
  emailOn: AccountSettingsNotifyOn;
  pushOn: AccountSettingsNotifyOn;
  considerNews: AccountSettingsConsiderNews;
  mailbox: AccountSettingsMailbox;
  profile: AccountSettingsProfile;
};

export type AccountSettingsNotifyOn = {
  newMessage: boolean;
  newSubstitution: boolean;
  newNews: boolean;
};

export type AccountSettingsConsiderNews = {
  newEvent: boolean;
  newBlog: boolean;
  newGallery: boolean;
  fileChanged: boolean;
};

export type AccountSettingsMailbox = {
  deleteAfter: number | null;
  deleteAfterInBin: number | null;
};

export type AccountSettingsProfile = {
  sessionTimeout: number;
  formOfAddress: FormOfAddress;
};

export const FORMS_OF_ADDRESS = ['formal', 'informal'] as const;
export type FormOfAddress = (typeof FORMS_OF_ADDRESS)[number];

export class AccountArangoRepository extends ArangoRepository<Account> {
  protected override collectionName = 'accounts';
}

export class ArangoAccountRepository implements AccountRepository {
  constructor(private readonly repository: AccountArangoRepository) {}

  async search(
    options: SearchOptions<js.Account>
  ): Promise<ListResult<WithId<js.Account>>> {
    const res = await this.repository.search({
      limit: options.limit,
      offset: options.offset,
      filter: filterFromGrpc(options.filter),
      order: options.order,
    });

    return {
      items: res.items.map((account) => accountToJs(account)),
      total: res.total,
    };
  }

  async get(id: string): Promise<WithId<js.Account> | null> {
    const res = await this.repository.get(id);

    return accountToJs(res);
  }

  async getByIds(
    ids: readonly string[]
  ): Promise<(WithId<js.Account> | null)[]> {
    const res = await this.repository.getByIds(ids);

    return res.map(accountToJs);
  }

  // TODO: Person Rev
  async create(account: js.Account): Promise<WithId<js.Account>> {
    const res = await this.repository.create(accountFromJs(account));

    return accountToJs(res);
  }

  async update(
    id: string,
    data: Partial<js.Account>,
    options?: { ifRev?: string }
  ): Promise<WithId<js.Account>> {
    const res = await this.repository.update(
      id,
      accountFromJs(data),
      options?.ifRev
    );

    return accountToJs(res);
  }

  async updateWhere(
    filter: object,
    data: Partial<js.Account>
  ): Promise<WithId<js.Account>[]> {
    const res = await this.repository.updateWhere(
      filterFromGrpc(filter),
      accountFromJs(data)
    );

    return res.map((account) => accountToJs(account));
  }

  async delete(
    id: string,
    options?: { ifRev?: string }
  ): Promise<WithId<js.Account>> {
    const res = await this.repository.delete(id, options?.ifRev);

    return accountToJs(res);
  }

  async deleteWhere(filter: object): Promise<WithId<js.Account>[]> {
    const res = await this.repository.deleteWhere(filterFromGrpc(filter));

    return res.map((account) => accountToJs(account));
  }
}

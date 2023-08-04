import {
  accountFromJs,
  accountToJs,
} from '#/repositories/arango/converters/account';
import * as js from '#/repositories/interfaces/account';
import { AccountRepository } from '#/repositories/interfaces/account';
import {
  ListResult,
  SearchOptions,
  WithId,
} from '#/repositories/interfaces/base';
import { MaybeArray, isNotNullOrUndefined } from '#/utils';
import { AndFilter, ArangoRepository, OrFilter, TypeFilter } from './base';

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
    options: SearchOptions
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

export function filterFromGrpc(filter: object): TypeFilter<Account>;
export function filterFromGrpc(
  filter: object | undefined
): TypeFilter<Account> | undefined;
export function filterFromGrpc(
  filter: object | undefined
): TypeFilter<Account> | undefined {
  if (filter === undefined) return undefined;

  return filterFromGrpcWorker(filter);
}

function filterFromGrpcWorker(
  filter: object | undefined
): TypeFilter<Account> | undefined {
  if (filter === undefined) return undefined;

  if ('and' in filter) {
    return new AndFilter(
      ...(filter.and as object[])
        .map(filterFromGrpcWorker)
        .filter(isNotNullOrUndefined)
    );
  }

  if ('or' in filter) {
    return new OrFilter(
      ...(filter.or as object[])
        .map(filterFromGrpcWorker)
        .filter(isNotNullOrUndefined)
    );
  }

  const { property, operator, value } = filter as {
    property: string;
    operator: string;
    value: MaybeArray<string | number | boolean | Buffer | null>;
  };

  switch (property) {
    case 'id':
      return { property: 'id', operator, value };
    case 'rev':
      return { property: 'rev', operator, value };
    case 'updated_at':
      return { property: 'updatedAt', operator, value };
    case 'created_at':
      return { property: 'createdAt', operator, value };
    case 'person_id':
      return { property: 'personId', operator, value };
    case 'username':
      return { property: 'username', operator, value };
    case 'email':
      return { property: 'email', operator, value };
    case 'password':
      return {
        property: 'password',
        operator,
        value: Buffer.from(value as string, 'base64'),
      };
    case 'salt':
      return {
        property: 'salt',
        operator,
        value: Buffer.from(value as string, 'base64'),
      };
    case 'password_expires_at':
      return {
        property: 'passwordExpiresAt',
        operator,
        value: new Date(value as number),
      };
    case 'lastLogin':
      return {
        property: 'last_login',
        operator,
        value: new Date(value as number),
      };
    case 'secondLastLogin':
      return {
        property: 'second_last_login',
        operator,
        value: new Date(value as number),
      };
    case 'settings.email_on.new_message':
      return { property: 'settings.emailOn.newMessage', operator, value };
    case 'settings.email_on.new_substitution':
      return {
        property: 'settings.emailOn.newSubstitution',
        operator,
        value,
      };
    case 'settings.email_on.new_news':
      return { property: 'settings.emailOn.newNews', operator, value };
    case 'settings.push_on.new_message':
      return { property: 'settings.pushOn.newMessage', operator, value };
    case 'settings.push_on.new_substitution':
      return { property: 'settings.pushOn.newSubstitution', operator, value };
    case 'settings.push_on.new_news':
      return { property: 'settings.pushOn.newNews', operator, value };
    case 'settings.consider_news.new_event':
      return { property: 'settings.considerNews.newEvent', operator, value };
    case 'settings.consider_news.new_blog':
      return { property: 'settings.considerNews.newBlog', operator, value };
    case 'settings.consider_news.new_gallery':
      return {
        property: 'settings.considerNews.newGallery',
        operator,
        value,
      };
    case 'settings.consider_news.file_changed':
      return {
        property: 'settings.considerNews.fileChanged',
        operator,
        value,
      };
    case 'settings.mailbox.delete_after':
      return { property: 'settings.mailbox.deleteAfter', operator, value };
    case 'settings.mailbox.delete_after_in_bin':
      return {
        property: 'settings.mailbox.deleteAfterInBin',
        operator,
        value,
      };
    case 'settings.profile.session_timeout':
      return { property: 'settings.profile.sessionTimeout', operator, value };
    case 'settings.profile.form_of_address':
      return {
        property: 'settings.profile.formOfAddress',
        operator,
        value,
      };
    default:
      throw new Error('Invariant: Unknown property in filter');
  }
}

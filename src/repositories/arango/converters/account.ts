import type * as js from '#/interfaces/account';
import * as jsBase from '#/repositories/interfaces/base';
import type * as db from '#/repositories/arango/services/account';
import * as dbBase from '#/repositories/arango/services/base';
import { isNotNullOrUndefined } from '#/utils';
import { ArangoConverter } from './base';

export class AccountConverter
  implements ArangoConverter<db.Account, js.Account>
{
  toJs(account: dbBase.WithKey<db.Account>): jsBase.WithId<js.Account>;
  toJs(
    account: dbBase.WithKey<db.Account> | null
  ): jsBase.WithId<js.Account> | null;
  toJs(
    account: dbBase.WithKey<db.Account> | null
  ): jsBase.WithId<js.Account> | null {
    if (account === null) return null;

    return {
      id: account._key,
      rev: account._rev,
      updatedAt: new Date(account.updatedAt),
      createdAt: new Date(account.createdAt),
      personId: account.personId,
      username: account.username,
      email: account.email,
      password: Buffer.from(account.password, 'base64'),
      salt: Buffer.from(account.salt, 'base64'),
      passwordExpiresAt:
        account.passwordExpiresAt === null
          ? null
          : new Date(account.passwordExpiresAt),
      lastLogin:
        account.lastLogin === null ? null : new Date(account.lastLogin),
      secondLastLogin:
        account.secondLastLogin === null
          ? null
          : new Date(account.secondLastLogin),
      settings: account.settings,
    };
  }

  fromJs(account: js.Account): db.Account;
  fromJs(account: Partial<js.Account>): Partial<db.Account>;
  fromJs(account: Partial<js.Account>): Partial<db.Account> {
    return {
      personId: account.personId,
      username: account.username,
      email: account.email,
      password: account.password?.toString('base64'),
      salt: account.salt?.toString('base64'),
      passwordExpiresAt:
        account.passwordExpiresAt === null
          ? null
          : account.passwordExpiresAt?.getTime(),
      lastLogin:
        account.lastLogin === null ? null : account.lastLogin?.getTime(),
      secondLastLogin:
        account.secondLastLogin === null
          ? null
          : account.secondLastLogin?.getTime(),
      settings: account.settings,
    };
  }

  filterFromJs(
    filter: jsBase.TypeFilter<jsBase.WithId<js.Account>> | undefined
  ): dbBase.TypeFilter<dbBase.WithKey<db.Account>> | undefined {
    if (filter === undefined) return undefined;
    if (filter === null) return null;

    if (filter instanceof jsBase.AndFilter) {
      return new dbBase.AndFilter(
        ...filter.filters
          .map((f) => this.filterFromJs(f))
          .filter(isNotNullOrUndefined)
      );
    }

    if (filter instanceof jsBase.OrFilter) {
      return new dbBase.OrFilter(
        ...filter.filters
          .map((f) => this.filterFromJs(f))
          .filter(isNotNullOrUndefined)
      );
    }

    const [property, operator, value] = filter.withTypes();

    switch (property) {
      case 'id':
        return { property: '_key', operator, value };
      case 'rev':
        return { property: '_rev', operator, value };
      case 'updatedAt':
        return {
          property: 'updatedAt',
          operator,
          value: value.getTime(),
        };
      case 'createdAt':
        return {
          property: 'createdAt',
          operator,
          value: value.getTime(),
        };
      case 'personId':
        return { property: 'personId', operator, value };
      case 'username':
        return { property: 'username', operator, value };
      case 'email':
        return { property: 'email', operator, value };
      case 'password':
        return {
          property: 'password',
          operator,
          value: value.toString('base64'),
        };
      case 'salt':
        return {
          property: 'salt',
          operator,
          value: value.toString('base64'),
        };
      case 'passwordExpiresAt':
        return {
          property: 'passwordExpiresAt',
          operator,
          value: value === null ? null : value.getTime(),
        };
      case 'lastLogin':
        return {
          property: 'lastLogin',
          operator,
          value: value === null ? null : value.getTime(),
        };
      case 'secondLastLogin':
        return {
          property: 'secondLastLogin',
          operator,
          value: value === null ? null : value.getTime(),
        };
      case 'settings.emailOn.newMessage':
        return { property: 'settings.emailOn.newMessage', operator, value };
      case 'settings.emailOn.newSubstitution':
        return {
          property: 'settings.emailOn.newSubstitution',
          operator,
          value,
        };
      case 'settings.emailOn.newNews':
        return { property: 'settings.emailOn.newNews', operator, value };
      case 'settings.pushOn.newMessage':
        return { property: 'settings.pushOn.newMessage', operator, value };
      case 'settings.pushOn.newSubstitution':
        return { property: 'settings.pushOn.newSubstitution', operator, value };
      case 'settings.pushOn.newNews':
        return { property: 'settings.pushOn.newNews', operator, value };
      case 'settings.considerNews.newEvent':
        return { property: 'settings.considerNews.newEvent', operator, value };
      case 'settings.considerNews.newBlog':
        return { property: 'settings.considerNews.newBlog', operator, value };
      case 'settings.considerNews.newGallery':
        return {
          property: 'settings.considerNews.newGallery',
          operator,
          value,
        };
      case 'settings.considerNews.fileChanged':
        return {
          property: 'settings.considerNews.fileChanged',
          operator,
          value,
        };
      case 'settings.mailbox.deleteAfter':
        return { property: 'settings.mailbox.deleteAfter', operator, value };
      case 'settings.mailbox.deleteAfterInBin':
        return {
          property: 'settings.mailbox.deleteAfterInBin',
          operator,
          value,
        };
      case 'settings.profile.sessionTimeout':
        return { property: 'settings.profile.sessionTimeout', operator, value };
      case 'settings.profile.formOfAddress':
        return {
          property: 'settings.profile.formOfAddress',
          operator,
          value,
        };
      default:
        throw new Error('Invariant: Unknown property in filter');
    }
  }
}

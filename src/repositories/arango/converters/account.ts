import type * as db from '#/repositories/arango/services/account';
import { WithKey } from '#/repositories/arango/services/base';
import type * as js from '#/repositories/interfaces/account';
import { WithId } from '#/repositories/interfaces/base';

export function accountToJs(account: WithKey<db.Account>): WithId<js.Account>;
export function accountToJs(
  account: WithKey<db.Account> | null
): WithId<js.Account> | null;
export function accountToJs(
  account: WithKey<db.Account> | null
): WithId<js.Account> | null {
  if (account === null) return null;

  return {
    id: account._key,
    rev: account._rev,
    updatedAt: account.updatedAt,
    createdAt: account.createdAt,
    personId: account.personId,
    username: account.username,
    email: account.email,
    password: Buffer.from(account.password, 'base64'),
    salt: Buffer.from(account.salt, 'base64'),
    passwordExpiresAt:
      account.passwordExpiresAt === null
        ? null
        : new Date(account.passwordExpiresAt),
    lastLogin: account.lastLogin === null ? null : new Date(account.lastLogin),
    secondLastLogin:
      account.secondLastLogin === null
        ? null
        : new Date(account.secondLastLogin),
    settings: account.settings,
  };
}

export function accountFromJs(account: js.Account): db.Account;
export function accountFromJs(
  account: Partial<js.Account>
): Partial<db.Account>;
export function accountFromJs(
  account: Partial<js.Account>
): Partial<db.Account> {
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
    lastLogin: account.lastLogin === null ? null : account.lastLogin?.getTime(),
    secondLastLogin:
      account.secondLastLogin === null
        ? null
        : account.secondLastLogin?.getTime(),
    settings: account.settings,
  };
}

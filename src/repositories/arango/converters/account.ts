import type * as db from '#/repositories/arango/services/account';
import { WithKey } from '#/repositories/arango/services/base';
import type * as js from '#/repositories/interfaces/account';
import { WithId } from '#/repositories/interfaces/base';

export function accountToJs(account: WithKey<db.Account>): WithId<js.Account> {
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
    passwordExpiresAt: account.passwordExpiresAt,
    lastLogin: account.lastLogin,
    secondLastLogin: account.secondLastLogin,
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
    passwordExpiresAt: account.passwordExpiresAt,
    lastLogin: account.lastLogin,
    secondLastLogin: account.secondLastLogin,
    settings: account.settings,
  };
}

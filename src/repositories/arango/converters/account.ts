import * as js from '#/models/account';
import type * as jsBase from '#/models/base';
import { FilterError } from '#/utils/errors';
import type * as db from '../models/account';
import type * as dbBase from '../models/base';
import {
  bufferFromArango,
  bufferToArango,
  dateFromArango,
  dateToArango,
  idFromArango,
} from './base';

export function accountFromArango(
  account: dbBase.WithKey<db.Account>
): jsBase.WithId<js.Account> {
  return {
    ...idFromArango(account),
    personId: account.personId,
    username: account.username,
    email: account.email,
    password: bufferFromArango(account.password),
    salt: bufferFromArango(account.salt),
    passwordExpiresAt:
      account.passwordExpiresAt === null
        ? null
        : dateFromArango(account.passwordExpiresAt),
    lastLogin:
      account.lastLogin === null ? null : dateFromArango(account.lastLogin),
    secondLastLogin:
      account.secondLastLogin === null
        ? null
        : dateFromArango(account.secondLastLogin),
    settings: accountSettingsFromArango(account.settings),
  };
}

function accountSettingsFromArango(
  accountSettings: db.AccountSettings
): js.AccountSettings {
  return {
    emailOn: accountSettingsNotifyOnFromArango(accountSettings.emailOn),
    pushOn: accountSettingsNotifyOnFromArango(accountSettings.pushOn),
    considerNews: accountSettingsConsiderNewsFromArango(
      accountSettings.considerNews
    ),
    mailbox: accountSettingsMailboxFromArango(accountSettings.mailbox),
    profile: accountSettingsProfileFromArango(accountSettings.profile),
  };
}

function accountSettingsNotifyOnFromArango(
  accountSettingsNotifyOn: db.AccountSettingsNotifyOn
): js.AccountSettingsNotifyOn {
  return {
    newMessage: accountSettingsNotifyOn.newMessage,
    newSubstitution: accountSettingsNotifyOn.newSubstitution,
    newNews: accountSettingsNotifyOn.newNews,
  };
}

function accountSettingsConsiderNewsFromArango(
  accountSettingsConsiderNews: db.AccountSettingsConsiderNews
): js.AccountSettingsConsiderNews {
  return {
    newEvent: accountSettingsConsiderNews.newEvent,
    newBlog: accountSettingsConsiderNews.newBlog,
    newGallery: accountSettingsConsiderNews.newGallery,
    fileChanged: accountSettingsConsiderNews.fileChanged,
  };
}

function accountSettingsMailboxFromArango(
  accountSettingsMailbox: db.AccountSettingsMailbox
): js.AccountSettingsMailbox {
  return {
    deleteAfter: accountSettingsMailbox.deleteAfter,
    deleteAfterInBin: accountSettingsMailbox.deleteAfterInBin,
  };
}

function accountSettingsProfileFromArango(
  accountSettingsProfile: db.AccountSettingsProfile
): js.AccountSettingsProfile {
  return {
    sessionTimeout: accountSettingsProfile.sessionTimeout,
    formOfAddress: formOfAddressFromArango(
      accountSettingsProfile.formOfAddress
    ),
  };
}

function formOfAddressFromArango(
  formOfAddress: db.FormOfAddress
): js.FormOfAddress {
  switch (formOfAddress) {
    case 'formal':
      return js.FormOfAddress.Formal;
    case 'informal':
      return js.FormOfAddress.Informal;
  }
}

export function accountToArango(account: js.Account): db.Account;
export function accountToArango(
  account: Partial<js.Account>
): Partial<db.Account>;
export function accountToArango(
  account: Partial<js.Account>
): Partial<db.Account> {
  return {
    personId: account.personId,
    username: account.username,
    email: account.email,
    password:
      account.password === undefined
        ? undefined
        : bufferToArango(account.password),
    salt: account.salt === undefined ? undefined : bufferToArango(account.salt),
    passwordExpiresAt:
      account.passwordExpiresAt === null
        ? null
        : account.passwordExpiresAt === undefined
        ? undefined
        : dateToArango(account.passwordExpiresAt),
    lastLogin:
      account.lastLogin === null
        ? null
        : account.lastLogin === undefined
        ? undefined
        : dateToArango(account.lastLogin),
    secondLastLogin:
      account.secondLastLogin === null
        ? null
        : account.secondLastLogin === undefined
        ? undefined
        : dateToArango(account.secondLastLogin),
    settings:
      account.settings === undefined
        ? undefined
        : accountSettingsToArango(account.settings),
  };
}

function accountSettingsToArango(
  accountSettings: js.AccountSettings
): db.AccountSettings {
  return {
    emailOn: accountSettingsNotifyOnToArango(accountSettings.emailOn),
    pushOn: accountSettingsNotifyOnToArango(accountSettings.pushOn),
    considerNews: accountSettingsConsiderNewsToArango(
      accountSettings.considerNews
    ),
    mailbox: accountSettingsMailboxToArango(accountSettings.mailbox),
    profile: accountSettingsProfileToArango(accountSettings.profile),
  };
}

function accountSettingsNotifyOnToArango(
  accountSettingsNotifyOn: js.AccountSettingsNotifyOn
): db.AccountSettingsNotifyOn {
  return {
    newMessage: accountSettingsNotifyOn.newMessage,
    newSubstitution: accountSettingsNotifyOn.newSubstitution,
    newNews: accountSettingsNotifyOn.newNews,
  };
}

function accountSettingsConsiderNewsToArango(
  accountSettingsConsiderNews: js.AccountSettingsConsiderNews
): db.AccountSettingsConsiderNews {
  return {
    newEvent: accountSettingsConsiderNews.newEvent,
    newBlog: accountSettingsConsiderNews.newBlog,
    newGallery: accountSettingsConsiderNews.newGallery,
    fileChanged: accountSettingsConsiderNews.fileChanged,
  };
}

function accountSettingsMailboxToArango(
  accountSettingsMailbox: js.AccountSettingsMailbox
): db.AccountSettingsMailbox {
  return {
    deleteAfter: accountSettingsMailbox.deleteAfter,
    deleteAfterInBin: accountSettingsMailbox.deleteAfterInBin,
  };
}

function accountSettingsProfileToArango(
  accountSettingsProfile: js.AccountSettingsProfile
): db.AccountSettingsProfile {
  return {
    sessionTimeout: accountSettingsProfile.sessionTimeout,
    formOfAddress: formOfAddressToArango(accountSettingsProfile.formOfAddress),
  };
}

function formOfAddressToArango(
  formOfAddress: js.FormOfAddress
): db.FormOfAddress {
  switch (formOfAddress) {
    case js.FormOfAddress.Formal:
      return 'formal';
    case js.FormOfAddress.Informal:
      return 'informal';
  }
}

export function accountFilterToArango(
  filter: jsBase.TypeFilter<jsBase.WithId<js.Account>>
): dbBase.TypeFilter<dbBase.WithKey<db.Account>> {
  if (filter === null) return null;

  if ('or' in filter) {
    return {
      or: filter.or.map((f) => accountFilterToArango(f)),
    };
  }

  if ('and' in filter) {
    return {
      and: filter.and.map((f) => accountFilterToArango(f)),
    };
  }

  const { property, operator, value } = filter;

  switch (property) {
    case 'id':
      switch (operator) {
        case 'eq':
        case 'neq':
        case 'like':
        case 'nlike':
          return {
            property: '_key',
            operator,
            value,
          };
        case 'in':
        case 'nin':
          return {
            property: '_key',
            operator,
            value,
          };
      }
    case 'rev':
      switch (operator) {
        case 'eq':
        case 'neq':
        case 'like':
        case 'nlike':
          return {
            property: '_rev',
            operator,
            value,
          };
        case 'in':
        case 'nin':
          return {
            property: '_rev',
            operator,
            value,
          };
      }
    case 'updatedAt':
    case 'createdAt':
      switch (operator) {
        case 'eq':
        case 'neq':
        case 'gt':
        case 'lt':
          return {
            property,
            operator,
            value: dateToArango(value),
          };
        case 'in':
        case 'nin':
          return {
            property,
            operator,
            value: value.map((v) => dateToArango(v)),
          };
      }
    case 'personId':
    case 'username':
    case 'email':
      return filter;
    case 'password':
    case 'salt':
      switch (operator) {
        case 'eq':
        case 'neq':
          return {
            property,
            operator,
            value: bufferToArango(value),
          };
      }
    case 'passwordExpiresAt':
    case 'lastLogin':
    case 'secondLastLogin':
      switch (operator) {
        case 'eq':
        case 'neq':
          return {
            property,
            operator,
            value: value === null ? null : dateToArango(value),
          };
        case 'in':
        case 'nin':
          return {
            property,
            operator,
            value: value.map((v) => (v === null ? null : dateToArango(v))),
          };
      }
    case 'settings.emailOn.newMessage':
    case 'settings.emailOn.newSubstitution':
    case 'settings.emailOn.newNews':
    case 'settings.pushOn.newMessage':
    case 'settings.pushOn.newSubstitution':
    case 'settings.pushOn.newNews':
    case 'settings.considerNews.newEvent':
    case 'settings.considerNews.newBlog':
    case 'settings.considerNews.newGallery':
    case 'settings.considerNews.fileChanged':
    case 'settings.mailbox.deleteAfter':
    case 'settings.mailbox.deleteAfterInBin':
    case 'settings.profile.sessionTimeout':
      return filter;
    case 'settings.profile.formOfAddress':
      switch (operator) {
        case 'eq':
        case 'neq':
          return {
            property,
            operator,
            value: formOfAddressToArango(value),
          };
        case 'gt':
        case 'lt':
        case 'in':
        case 'nin':
          throw new FilterError(property, operator, 'FormOfAddress');
      }
  }
}

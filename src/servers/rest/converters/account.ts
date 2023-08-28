import * as js from '#/services/account';
import type * as jsBase from '#/services/base';
import { ClientFilterError } from '#/utils/errors';
import type * as rest from '../controllers/account-controller';
import type * as restBase from '../controllers/base';
import {
  bufferFromRest,
  bufferToRest,
  dateFromRest,
  dateToRest,
  idToRest,
} from './base';

export function accountToRest(
  account: jsBase.WithId<js.Account>
): restBase.WithId<rest.Account> {
  return {
    ...idToRest(account),
    personId: account.personId,
    username: account.username,
    email: account.email,
    password: bufferToRest(account.password),
    salt: bufferToRest(account.salt),
    passwordExpiresAt:
      account.passwordExpiresAt === null
        ? null
        : dateToRest(account.passwordExpiresAt),
    lastLogin:
      account.lastLogin === null ? null : dateToRest(account.lastLogin),
    secondLastLogin:
      account.secondLastLogin === null
        ? null
        : dateToRest(account.secondLastLogin),
    settings: accountSettingsToRest(account.settings),
  };
}

function accountSettingsToRest(
  accountSettings: js.AccountSettings
): rest.AccountSettings {
  return {
    emailOn: accountSettingsNotifyOnToRest(accountSettings.emailOn),
    pushOn: accountSettingsNotifyOnToRest(accountSettings.pushOn),
    considerNews: accountSettingsConsiderNewsToRest(
      accountSettings.considerNews
    ),
    mailbox: accountSettingsMailboxToRest(accountSettings.mailbox),
    profile: accountSettingsProfileToRest(accountSettings.profile),
  };
}

function accountSettingsNotifyOnToRest(
  accountSettingsNotifyOn: js.AccountSettingsNotifyOn
): rest.AccountSettingsNotifyOn {
  return {
    newMessage: accountSettingsNotifyOn.newMessage,
    newSubstitution: accountSettingsNotifyOn.newSubstitution,
    newNews: accountSettingsNotifyOn.newNews,
  };
}

function accountSettingsConsiderNewsToRest(
  accountSettingsConsiderNews: js.AccountSettingsConsiderNews
): rest.AccountSettingsConsiderNews {
  return {
    newEvent: accountSettingsConsiderNews.newEvent,
    newBlog: accountSettingsConsiderNews.newBlog,
    newGallery: accountSettingsConsiderNews.newGallery,
    fileChanged: accountSettingsConsiderNews.fileChanged,
  };
}

function accountSettingsMailboxToRest(
  accountSettingsMailbox: js.AccountSettingsMailbox
): rest.AccountSettingsMailbox {
  return {
    deleteAfter: accountSettingsMailbox.deleteAfter,
    deleteAfterInBin: accountSettingsMailbox.deleteAfterInBin,
  };
}

function accountSettingsProfileToRest(
  accountSettingsProfile: js.AccountSettingsProfile
): rest.AccountSettingsProfile {
  return {
    sessionTimeout: accountSettingsProfile.sessionTimeout,
    formOfAddress: formOfAddressToRest(accountSettingsProfile.formOfAddress),
  };
}

function formOfAddressToRest(
  formOfAddress: js.FormOfAddress
): rest.FormOfAddress {
  switch (formOfAddress) {
    case js.FormOfAddress.Formal:
      return 'formal';
    case js.FormOfAddress.Informal:
      return 'informal';
  }
}

export function accountFromRest(account: rest.Account): js.Account;
export function accountFromRest(
  account: Partial<rest.Account>
): Partial<js.Account>;
export function accountFromRest(
  account: Partial<rest.Account>
): Partial<js.Account> {
  return {
    personId: account.personId,
    username: account.username,
    email: account.email,
    password:
      account.password === undefined
        ? undefined
        : bufferFromRest(account.password),
    salt: account.salt === undefined ? undefined : bufferFromRest(account.salt),
    passwordExpiresAt:
      account.passwordExpiresAt === null
        ? null
        : account.passwordExpiresAt === undefined
        ? undefined
        : dateFromRest(account.passwordExpiresAt),
    lastLogin:
      account.lastLogin === null
        ? null
        : account.lastLogin === undefined
        ? undefined
        : dateFromRest(account.lastLogin),
    secondLastLogin:
      account.secondLastLogin === null
        ? null
        : account.secondLastLogin === undefined
        ? undefined
        : dateFromRest(account.secondLastLogin),
    settings:
      account.settings === undefined
        ? undefined
        : accountSettingsFromRest(account.settings),
  };
}

function accountSettingsFromRest(
  accountSettings: rest.AccountSettings
): js.AccountSettings {
  return {
    emailOn: accountSettingsNotifyOnFromRest(accountSettings.emailOn),
    pushOn: accountSettingsNotifyOnFromRest(accountSettings.pushOn),
    considerNews: accountSettingsConsiderNewsFromRest(
      accountSettings.considerNews
    ),
    mailbox: accountSettingsMailboxFromRest(accountSettings.mailbox),
    profile: accountSettingsProfileFromRest(accountSettings.profile),
  };
}

function accountSettingsNotifyOnFromRest(
  accountSettingsNotifyOn: rest.AccountSettingsNotifyOn
): js.AccountSettingsNotifyOn {
  return {
    newMessage: accountSettingsNotifyOn.newMessage,
    newSubstitution: accountSettingsNotifyOn.newSubstitution,
    newNews: accountSettingsNotifyOn.newNews,
  };
}

function accountSettingsConsiderNewsFromRest(
  accountSettingsConsiderNews: rest.AccountSettingsConsiderNews
): js.AccountSettingsConsiderNews {
  return {
    newEvent: accountSettingsConsiderNews.newEvent,
    newBlog: accountSettingsConsiderNews.newBlog,
    newGallery: accountSettingsConsiderNews.newGallery,
    fileChanged: accountSettingsConsiderNews.fileChanged,
  };
}

function accountSettingsMailboxFromRest(
  accountSettingsMailbox: rest.AccountSettingsMailbox
): js.AccountSettingsMailbox {
  return {
    deleteAfter: accountSettingsMailbox.deleteAfter,
    deleteAfterInBin: accountSettingsMailbox.deleteAfterInBin,
  };
}

function accountSettingsProfileFromRest(
  accountSettingsProfile: rest.AccountSettingsProfile
): js.AccountSettingsProfile {
  return {
    sessionTimeout: accountSettingsProfile.sessionTimeout,
    formOfAddress: formOfAddressFromRest(accountSettingsProfile.formOfAddress),
  };
}

function formOfAddressFromRest(
  formOfAddress: rest.FormOfAddress
): js.FormOfAddress {
  switch (formOfAddress) {
    case 'formal':
      return js.FormOfAddress.Formal;
    case 'informal':
      return js.FormOfAddress.Informal;
  }
}

export function accountFilterFromRest(
  filter: restBase.TypeFilter<restBase.WithId<rest.Account>>
): jsBase.TypeFilter<jsBase.WithId<js.Account>> {
  if (filter === null) return null;

  if ('or' in filter) {
    return {
      or: filter.or.map((f) => accountFilterFromRest(f)),
    };
  }

  if ('and' in filter) {
    return {
      and: filter.and.map((f) => accountFilterFromRest(f)),
    };
  }

  const { property, operator, value } = filter;

  switch (property) {
    case 'id':
    case 'rev':
      return filter;
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
            value: dateFromRest(value),
          };
        case 'in':
        case 'nin':
          return {
            property,
            operator,
            value: value.map((v) => dateFromRest(v)),
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
            value: bufferFromRest(value),
          };
        case 'like':
        case 'nlike':
        case 'in':
        case 'nin':
          throw new ClientFilterError(property, operator, 'Buffer');
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
            value: value === null ? null : dateFromRest(value),
          };
        case 'in':
        case 'nin':
          return {
            property,
            operator,
            value: value.map((v) => (v === null ? null : dateFromRest(v))),
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
            value: formOfAddressFromRest(value),
          };
        case 'like':
        case 'nlike':
        case 'in':
        case 'nin':
          throw new ClientFilterError(property, operator, 'FormOfAddress');
      }
  }
}

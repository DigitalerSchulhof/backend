import type { BaseRepository, WithId } from './base';

export type Account = {
  personId: string;
  username: string;
  email: string;
  password: Buffer;
  salt: Buffer;
  passwordExpiresAt: Date | null;
  lastLogin: Date | null;
  secondLastLogin: Date | null;
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

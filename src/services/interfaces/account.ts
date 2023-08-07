import { AccountPermissionHandler } from '#/permissions/account';
import { AccountRepository } from '#/repositories/interfaces/account';
import { RequestContext } from '#/server';
import { AccountValidator } from '#/validators/account';
import {
  BaseService,
  ListResult,
  SearchOptions,
  TypeFilter,
  WithId,
} from './base';

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

export class AccountService extends BaseService<Account> {
  constructor(
    private readonly repository: AccountRepository,
    private readonly validator: AccountValidator,
    private readonly permissionHandler: AccountPermissionHandler
  ) {
    super();
  }

  override async search(
    context: RequestContext,
    options: SearchOptions<Account>
  ): Promise<ListResult<WithId<Account>>> {
    await this.permissionHandler.assertMaySearch(context);

    return this.repository.search(options);
  }

  override async get(
    context: RequestContext,
    ids: readonly string[]
  ): Promise<(WithId<Account> | null)[]> {
    await this.permissionHandler.assertMayGet(context, ids);

    return this.repository.getByIds(ids);
  }

  override async create(
    context: RequestContext,
    data: Account,
    options?: {
      /**
       * Only creates the account if the person has the given rev.
       */
      ifPersonRev?: string;
    }
  ): Promise<WithId<Account>> {
    await this.permissionHandler.assertMayCreate(context, data);
    await this.validator.assertCanCreate(data);

    return this.repository.create(data, options);
  }

  override async update(
    context: RequestContext,
    id: string,
    data: Partial<Account>,
    options?: { ifRev?: string }
  ): Promise<WithId<Account>> {
    await this.permissionHandler.assertMayUpdate(context, id, data);
    await this.validator.assertCanUpdate(id, data);

    return this.repository.update(id, data, options);
  }

  override async updateWhere(
    context: RequestContext,
    filter: TypeFilter<Account>,
    data: Partial<Account>
  ): Promise<WithId<Account>[]> {
    await this.permissionHandler.assertMayUpdateMany(context, data);
    await this.validator.assertCanUpdateMany(data);

    return this.repository.updateWhere(filter, data);
  }

  override async delete(
    context: RequestContext,
    id: string,
    options?: { ifRev?: string }
  ): Promise<WithId<Account>> {
    await this.permissionHandler.assertMayDelete(context, id);

    return this.repository.delete(id, options);
  }

  override async deleteWhere(
    context: RequestContext,
    filter: TypeFilter<Account>
  ): Promise<WithId<Account>[]> {
    await this.permissionHandler.assertMayDeleteMany(context);

    return this.repository.deleteWhere(filter);
  }
}

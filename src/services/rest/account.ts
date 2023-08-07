import { RequestContext } from '#/server';
import { Account, AccountService } from '#/services/interfaces/account';
import { WithId } from '#/services/interfaces/base';
import type * as koa from 'koa';
import { Controller, Get, Path, Request, Route } from 'tsoa';

type Request = koa.Request;

interface RestContextManager {
  get(req: Request): Promise<RequestContext>;
}

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

@Route('accounts')
export class AccountRestService extends Controller {
  constructor(
    private readonly contextManager: RestContextManager,
    private readonly service: AccountService
  ) {
    super();
  }

  @Get('{ids}')
  async get(
    @Request() req: Request,
    @Path() ids: string
  ): Promise<WithId<Account> | null> {
    const context = await this.contextManager.get(req);

    return this.service.get(context, ids.split(','));
  }
}

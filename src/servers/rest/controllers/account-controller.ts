import * as js from '#/services/account';
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Path,
  Post,
  Query,
  Request,
  Route,
} from 'tsoa';
import {
  accountFilterFromRest,
  accountFromRest,
  accountToRest,
} from '../converters/accounts';
import type {
  ListResult,
  Req,
  RestContextManager,
  SearchOptions,
  WithId,
} from './base';

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

export type FormOfAddress = 'formal' | 'informal';

@Route('accounts')
export class RestAccountController extends Controller {
  constructor(
    private readonly contextManager: RestContextManager,
    private readonly service: js.AccountService
  ) {
    super();
  }

  @Post('search')
  async search(
    @Request() req: Req,
    @Body() searchOptions: SearchOptions<WithId<Account>>
  ): Promise<ListResult<Account>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.search(context, {
      limit: searchOptions.limit,
      offset: searchOptions.offset,
      filter:
        searchOptions.filter === undefined
          ? undefined
          : accountFilterFromRest(searchOptions.filter),
      order: searchOptions.order,
    });

    return {
      items: res.items.map((r) => accountToRest(r)),
      total: res.total,
    };
  }

  @Get(':ids')
  async get(
    @Request() req: Req,
    @Path() ids: string
  ): Promise<(WithId<Account> | null)[]> {
    const context = await this.contextManager.get(req);

    const res = await this.service.get(context, ids.split(','));

    return res.map((r) => (r === null ? null : accountToRest(r)));
  }

  @Post('')
  async create(
    @Request() req: Req,
    @Body() data: Account,
    @Query() ifPersonRev?: string | undefined
  ): Promise<WithId<Account>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.create(context, accountFromRest(data), {
      ifPersonRev,
    });

    return accountToRest(res);
  }

  @Patch(':id')
  async update(
    @Request() req: Req,
    @Path() id: string,
    @Body() data: Partial<Account>,
    @Query() ifRev: string | undefined
  ): Promise<WithId<Account>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.update(context, id, accountFromRest(data), {
      ifRev,
    });

    return accountToRest(res);
  }

  @Delete(':id')
  async delete(
    @Request() req: Req,
    @Path() id: string,
    @Query() ifRev: string | undefined
  ): Promise<WithId<Account>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.delete(context, id, { ifRev });

    return accountToRest(res);
  }
}

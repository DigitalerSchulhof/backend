import { ListResult, SearchOptions } from '#/models/base';
import { AccountService } from '#/services/account';
import {
  Body,
  Delete,
  Get,
  Patch,
  Path,
  Post,
  Query,
  Req,
  Route,
  Tags,
} from 'bttp';
import {
  accountFilterFromRest,
  accountFromRest,
  accountToRest,
} from '../converters/account';
import { Account } from '../models/account';
import { WithId } from '../models/base';
import { RestContextManager } from './base';

@Route('accounts')
@Tags('Account')
export class RestAccountController {
  constructor(
    private readonly contextManager: RestContextManager,
    private readonly service: AccountService
  ) {}

  @Post('search')
  async search(
    @Req() req: Request,
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

  @Get(':id')
  async get(
    @Req() req: Request,
    @Path() id: string
  ): Promise<(WithId<Account> | null)[]> {
    const context = await this.contextManager.get(req);

    const res = await this.service.get(context, id.split(','));

    return res.map((r) => (r === null ? null : accountToRest(r)));
  }

  @Post('')
  async create(
    @Req() req: Request,
    @Body() data: Account,
    @Query() ifPersonRev?: string
  ): Promise<WithId<Account>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.create(context, accountFromRest(data), {
      ifPersonRev,
    });

    return accountToRest(res);
  }

  @Patch(':id')
  async update(
    @Req() req: Request,
    @Path() id: string,
    @Body() data: Partial<Account>,
    @Query() ifRev?: string
  ): Promise<WithId<Account>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.update(context, id, accountFromRest(data), {
      ifRev,
    });

    return accountToRest(res);
  }

  @Delete(':id')
  async delete(
    @Req() req: Request,
    @Path() id: string,
    @Query() ifRev?: string
  ): Promise<WithId<Account>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.delete(context, id, { ifRev });

    return accountToRest(res);
  }
}

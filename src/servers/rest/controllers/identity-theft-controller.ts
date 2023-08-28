import { IdentityTheftService } from '#/services/identity-theft';
import { serviceTokens } from '#/services/tokens';
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
  Tags,
} from 'tsoa';
import { tokens } from 'typed-inject';
import {
  identityTheftFilterFromRest,
  identityTheftFromRest,
  identityTheftToRest,
} from '../converters/identity-theft';
import {
  ListResult,
  Req,
  RestContextManager,
  SearchOptions,
  WithId,
} from './base';
import { restControllerTokens } from './tokens';

export type IdentityTheft = {
  personId: string;
  reportedAt: number;
};

@Route('identity-thefts')
@Tags('Identity Theft')
export class RestIdentityTheftController extends Controller {
  constructor(
    private readonly contextManager: RestContextManager,
    private readonly service: IdentityTheftService
  ) {
    super();
  }

  static readonly inject = tokens(
    'contextManager',
    serviceTokens.identityTheftService
  );

  static readonly key = restControllerTokens.identityTheftController;

  @Post('search')
  async search(
    @Request() req: Req,
    @Body() searchOptions: SearchOptions<WithId<IdentityTheft>>
  ): Promise<ListResult<IdentityTheft>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.search(context, {
      limit: searchOptions.limit,
      offset: searchOptions.offset,
      filter:
        searchOptions.filter === undefined
          ? undefined
          : identityTheftFilterFromRest(searchOptions.filter),
      order: searchOptions.order,
    });

    return {
      items: res.items.map((r) => identityTheftToRest(r)),
      total: res.total,
    };
  }

  @Get(':ids')
  async get(
    @Request() req: Req,
    @Path() ids: string
  ): Promise<(WithId<IdentityTheft> | null)[]> {
    const context = await this.contextManager.get(req);

    const res = await this.service.get(context, ids.split(','));

    return res.map((r) => (r === null ? null : identityTheftToRest(r)));
  }

  @Post('')
  async create(
    @Request() req: Req,
    @Body() data: IdentityTheft
  ): Promise<WithId<IdentityTheft>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.create(context, identityTheftFromRest(data));

    return identityTheftToRest(res);
  }

  @Patch(':id')
  async update(
    @Request() req: Req,
    @Path() id: string,
    @Body() data: Partial<IdentityTheft>,
    @Query() ifRev?: string
  ): Promise<WithId<IdentityTheft>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.update(
      context,
      id,
      identityTheftFromRest(data),
      {
        ifRev,
      }
    );

    return identityTheftToRest(res);
  }

  @Delete(':id')
  async delete(
    @Request() req: Req,
    @Path() id: string,
    @Query() ifRev?: string
  ): Promise<WithId<IdentityTheft>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.delete(context, id, { ifRev });

    return identityTheftToRest(res);
  }
}

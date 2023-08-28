import { SessionService } from '#/services/session';
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
  sessionFilterFromRest,
  sessionFromRest,
  sessionToRest,
} from '../converters/session';
import {
  ListResult,
  Req,
  RestContextManager,
  SearchOptions,
  WithId,
} from './base';
import { restControllerTokens } from './tokens';

export type Session = {
  accountId: string;
  issuedAt: number;
  didShowLastLogin: boolean;
};

@Route('sessions')
@Tags('Session')
export class RestSessionController extends Controller {
  constructor(
    private readonly contextManager: RestContextManager,
    private readonly service: SessionService
  ) {
    super();
  }

  static readonly inject = tokens(
    'contextManager',
    serviceTokens.sessionService
  );

  static readonly key = restControllerTokens.sessionController;

  @Post('search')
  async search(
    @Request() req: Req,
    @Body() searchOptions: SearchOptions<WithId<Session>>
  ): Promise<ListResult<Session>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.search(context, {
      limit: searchOptions.limit,
      offset: searchOptions.offset,
      filter:
        searchOptions.filter === undefined
          ? undefined
          : sessionFilterFromRest(searchOptions.filter),
      order: searchOptions.order,
    });

    return {
      items: res.items.map((r) => sessionToRest(r)),
      total: res.total,
    };
  }

  @Get(':ids')
  async get(
    @Request() req: Req,
    @Path() ids: string
  ): Promise<(WithId<Session> | null)[]> {
    const context = await this.contextManager.get(req);

    const res = await this.service.get(context, ids.split(','));

    return res.map((r) => (r === null ? null : sessionToRest(r)));
  }

  @Post('')
  async create(
    @Request() req: Req,
    @Body() data: Session
  ): Promise<WithId<Session>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.create(context, sessionFromRest(data));

    return sessionToRest(res);
  }

  @Patch(':id')
  async update(
    @Request() req: Req,
    @Path() id: string,
    @Body() data: Partial<Session>,
    @Query() ifRev?: string
  ): Promise<WithId<Session>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.update(context, id, sessionFromRest(data), {
      ifRev,
    });

    return sessionToRest(res);
  }

  @Delete(':id')
  async delete(
    @Request() req: Req,
    @Path() id: string,
    @Query() ifRev?: string
  ): Promise<WithId<Session>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.delete(context, id, { ifRev });

    return sessionToRest(res);
  }
}

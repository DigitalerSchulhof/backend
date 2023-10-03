import { ListResult, SearchOptions } from '#/models/base';
import { SessionService } from '#/services/session';
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
  sessionFilterFromRest,
  sessionFromRest,
  sessionToRest,
} from '../converters/session';
import { WithId } from '../models/base';
import { Session } from '../models/session';
import { RestContextManager } from './base';

@Route('sessions')
@Tags('Session')
export class RestSessionController {
  constructor(
    private readonly contextManager: RestContextManager,
    private readonly service: SessionService
  ) {}

  @Post('search')
  async search(
    @Req() req: Request,
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

  @Get(':id')
  async get(
    @Req() req: Request,
    @Path() id: string
  ): Promise<(WithId<Session> | null)[]> {
    const context = await this.contextManager.get(req);

    const res = await this.service.get(context, id.split(','));

    return res.map((r) => (r === null ? null : sessionToRest(r)));
  }

  @Post('')
  async create(
    @Req() req: Request,
    @Body() data: Session
  ): Promise<WithId<Session>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.create(context, sessionFromRest(data));

    return sessionToRest(res);
  }

  @Patch(':id')
  async update(
    @Req() req: Request,
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
    @Req() req: Request,
    @Path() id: string,
    @Query() ifRev?: string
  ): Promise<WithId<Session>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.delete(context, id, { ifRev });

    return sessionToRest(res);
  }
}

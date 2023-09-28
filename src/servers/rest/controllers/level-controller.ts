import { LevelService } from '#/services/level';
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
  levelFilterFromRest,
  levelFromRest,
  levelToRest,
} from '../converters/level';
import { ListResult, RestContextManager, SearchOptions, WithId } from './base';
import { restControllerTokens } from './tokens';

export type Level = {
  name: string;
  schoolyearId: string;
};

@Route('levels')
@Tags('Level')
export class RestLevelController extends Controller {
  constructor(
    private readonly contextManager: RestContextManager,
    private readonly service: LevelService
  ) {
    super();
  }

  static readonly inject = tokens('contextManager', serviceTokens.levelService);

  static readonly key = restControllerTokens.levelController;

  @Post('search')
  async search(
    @Request() req: Request,
    @Body() searchOptions: SearchOptions<WithId<Level>>
  ): Promise<ListResult<Level>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.search(context, {
      limit: searchOptions.limit,
      offset: searchOptions.offset,
      filter:
        searchOptions.filter === undefined
          ? undefined
          : levelFilterFromRest(searchOptions.filter),
      order: searchOptions.order,
    });

    return {
      items: res.items.map((r) => levelToRest(r)),
      total: res.total,
    };
  }

  @Get(':ids')
  async get(
    @Request() req: Request,
    @Path() ids: string
  ): Promise<(WithId<Level> | null)[]> {
    const context = await this.contextManager.get(req);

    const res = await this.service.get(context, ids.split(','));

    return res.map((r) => (r === null ? null : levelToRest(r)));
  }

  @Post('')
  async create(
    @Request() req: Request,
    @Body() data: Level
  ): Promise<WithId<Level>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.create(context, levelFromRest(data));

    return levelToRest(res);
  }

  @Patch(':id')
  async update(
    @Request() req: Request,
    @Path() id: string,
    @Body() data: Partial<Level>,
    @Query() ifRev?: string
  ): Promise<WithId<Level>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.update(context, id, levelFromRest(data), {
      ifRev,
    });

    return levelToRest(res);
  }

  @Delete(':id')
  async delete(
    @Request() req: Request,
    @Path() id: string,
    @Query() ifRev?: string
  ): Promise<WithId<Level>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.delete(context, id, { ifRev });

    return levelToRest(res);
  }
}

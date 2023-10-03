import { ListResult, SearchOptions } from '#/models/base';
import { LevelService } from '#/services/level';
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
  levelFilterFromRest,
  levelFromRest,
  levelToRest,
} from '../converters/level';
import { WithId } from '../models/base';
import { Level } from '../models/level';
import { RestContextManager } from './base';

@Route('levels')
@Tags('Level')
export class RestLevelController {
  constructor(
    private readonly contextManager: RestContextManager,
    private readonly service: LevelService
  ) {}

  @Post('search')
  async search(
    @Req() req: Request,
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

  @Get(':id')
  async get(
    @Req() req: Request,
    @Path() id: string
  ): Promise<(WithId<Level> | null)[]> {
    const context = await this.contextManager.get(req);

    const res = await this.service.get(context, id.split(','));

    return res.map((r) => (r === null ? null : levelToRest(r)));
  }

  @Post('')
  async create(
    @Req() req: Request,
    @Body() data: Level
  ): Promise<WithId<Level>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.create(context, levelFromRest(data));

    return levelToRest(res);
  }

  @Patch(':id')
  async update(
    @Req() req: Request,
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
    @Req() req: Request,
    @Path() id: string,
    @Query() ifRev?: string
  ): Promise<WithId<Level>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.delete(context, id, { ifRev });

    return levelToRest(res);
  }
}

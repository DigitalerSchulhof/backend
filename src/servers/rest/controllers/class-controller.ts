import { ClassService } from '#/services/class';
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
  classFilterFromRest,
  classFromRest,
  classToRest,
} from '../converters/class';
import { ListResult, RestContextManager, SearchOptions, WithId } from './base';
import { restControllerTokens } from './tokens';

export type Class = {
  name: string;
  levelId: string;
};

@Route('classes')
@Tags('Class')
export class RestClassController extends Controller {
  constructor(
    private readonly contextManager: RestContextManager,
    private readonly service: ClassService
  ) {
    super();
  }

  static readonly inject = tokens('contextManager', serviceTokens.classService);

  static readonly key = restControllerTokens.classController;

  @Post('search')
  async search(
    @Request() req: Request,
    @Body() searchOptions: SearchOptions<WithId<Class>>
  ): Promise<ListResult<Class>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.search(context, {
      limit: searchOptions.limit,
      offset: searchOptions.offset,
      filter:
        searchOptions.filter === undefined
          ? undefined
          : classFilterFromRest(searchOptions.filter),
      order: searchOptions.order,
    });

    return {
      items: res.items.map((r) => classToRest(r)),
      total: res.total,
    };
  }

  @Get(':ids')
  async get(
    @Request() req: Request,
    @Path() ids: string
  ): Promise<(WithId<Class> | null)[]> {
    const context = await this.contextManager.get(req);

    const res = await this.service.get(context, ids.split(','));

    return res.map((r) => (r === null ? null : classToRest(r)));
  }

  @Post('')
  async create(
    @Request() req: Request,
    @Body() data: Class
  ): Promise<WithId<Class>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.create(context, classFromRest(data));

    return classToRest(res);
  }

  @Patch(':id')
  async update(
    @Request() req: Request,
    @Path() id: string,
    @Body() data: Partial<Class>,
    @Query() ifRev?: string
  ): Promise<WithId<Class>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.update(context, id, classFromRest(data), {
      ifRev,
    });

    return classToRest(res);
  }

  @Delete(':id')
  async delete(
    @Request() req: Request,
    @Path() id: string,
    @Query() ifRev?: string
  ): Promise<WithId<Class>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.delete(context, id, { ifRev });

    return classToRest(res);
  }
}

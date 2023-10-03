import { ListResult, SearchOptions } from '#/models/base';
import { ClassService } from '#/services/class';
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
  classFilterFromRest,
  classFromRest,
  classToRest,
} from '../converters/class';
import { WithId } from '../models/base';
import { Class } from '../models/class';
import { RestContextManager } from './base';

@Route('classes')
@Tags('Class')
export class RestClassController {
  constructor(
    private readonly contextManager: RestContextManager,
    private readonly service: ClassService
  ) {}

  @Post('search')
  async search(
    @Req() req: Request,
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

  @Get(':id')
  async get(
    @Req() req: Request,
    @Path() id: string
  ): Promise<(WithId<Class> | null)[]> {
    const context = await this.contextManager.get(req);

    const res = await this.service.get(context, id.split(','));

    return res.map((r) => (r === null ? null : classToRest(r)));
  }

  @Post('')
  async create(
    @Req() req: Request,
    @Body() data: Class
  ): Promise<WithId<Class>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.create(context, classFromRest(data));

    return classToRest(res);
  }

  @Patch(':id')
  async update(
    @Req() req: Request,
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
    @Req() req: Request,
    @Path() id: string,
    @Query() ifRev?: string
  ): Promise<WithId<Class>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.delete(context, id, { ifRev });

    return classToRest(res);
  }
}

import { ListResult, SearchOptions } from '#/models/base';
import { SchoolyearService } from '#/services/schoolyear';
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
  schoolyearFilterFromRest,
  schoolyearFromRest,
  schoolyearToRest,
} from '../converters/schoolyear';
import { WithId } from '../models/base';
import { Schoolyear } from '../models/schoolyear';
import { RestContextManager } from './base';

@Route('schoolyears')
@Tags('Schoolyear')
export class RestSchoolyearController {
  constructor(
    private readonly contextManager: RestContextManager,
    private readonly service: SchoolyearService
  ) {}

  @Post('search')
  async search(
    @Req() req: Request,
    @Body() searchOptions: SearchOptions<WithId<Schoolyear>>
  ): Promise<ListResult<Schoolyear>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.search(context, {
      limit: searchOptions.limit,
      offset: searchOptions.offset,
      filter:
        searchOptions.filter === undefined
          ? undefined
          : schoolyearFilterFromRest(searchOptions.filter),
      order: searchOptions.order,
    });

    return {
      items: res.items.map((r) => schoolyearToRest(r)),
      total: res.total,
    };
  }

  @Get(':id')
  async get(
    @Req() req: Request,
    @Path() id: string
  ): Promise<(WithId<Schoolyear> | null)[]> {
    const context = await this.contextManager.get(req);

    const res = await this.service.get(context, id.split(','));

    return res.map((r) => (r === null ? null : schoolyearToRest(r)));
  }

  @Post('')
  async create(
    @Req() req: Request,
    @Body() data: Schoolyear
  ): Promise<WithId<Schoolyear>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.create(context, schoolyearFromRest(data));

    return schoolyearToRest(res);
  }

  @Patch(':id')
  async update(
    @Req() req: Request,
    @Path() id: string,
    @Body() data: Partial<Schoolyear>,
    @Query() ifRev?: string
  ): Promise<WithId<Schoolyear>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.update(
      context,
      id,
      schoolyearFromRest(data),
      {
        ifRev,
      }
    );

    return schoolyearToRest(res);
  }

  @Delete(':id')
  async delete(
    @Req() req: Request,
    @Path() id: string,
    @Query() ifRev?: string
  ): Promise<WithId<Schoolyear>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.delete(context, id, { ifRev });

    return schoolyearToRest(res);
  }
}

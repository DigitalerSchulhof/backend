import { SchoolyearService } from '#/services/schoolyear';
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
  schoolyearFilterFromRest,
  schoolyearFromRest,
  schoolyearToRest,
} from '../converters/schoolyear';
import {
  ListResult,
  Req,
  RestContextManager,
  SearchOptions,
  WithId,
} from './base';
import { restControllerTokens } from './tokens';

export type Schoolyear = {
  name: string;
  start: number;
  end: number;
};

@Route('schoolyears')
@Tags('Schoolyear')
export class RestSchoolyearController extends Controller {
  constructor(
    private readonly contextManager: RestContextManager,
    private readonly service: SchoolyearService
  ) {
    super();
  }

  static readonly inject = tokens(
    'contextManager',
    serviceTokens.schoolyearService
  );

  static readonly key = restControllerTokens.schoolyearController;

  @Post('search')
  async search(
    @Request() req: Req,
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

  @Get(':ids')
  async get(
    @Request() req: Req,
    @Path() ids: string
  ): Promise<(WithId<Schoolyear> | null)[]> {
    const context = await this.contextManager.get(req);

    const res = await this.service.get(context, ids.split(','));

    return res.map((r) => (r === null ? null : schoolyearToRest(r)));
  }

  @Post('')
  async create(
    @Request() req: Req,
    @Body() data: Schoolyear
  ): Promise<WithId<Schoolyear>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.create(context, schoolyearFromRest(data));

    return schoolyearToRest(res);
  }

  @Patch(':id')
  async update(
    @Request() req: Req,
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
    @Request() req: Req,
    @Path() id: string,
    @Query() ifRev?: string
  ): Promise<WithId<Schoolyear>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.delete(context, id, { ifRev });

    return schoolyearToRest(res);
  }
}

import { ListResult, SearchOptions } from '#/models/base';
import { PersonService } from '#/services/person';
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
  personFilterFromRest,
  personFromRest,
  personToRest,
} from '../converters/person';
import { WithId } from '../models/base';
import { Person } from '../models/person';
import { RestContextManager } from './base';

@Route('persons')
@Tags('Person')
export class RestPersonController {
  constructor(
    private readonly contextManager: RestContextManager,
    private readonly service: PersonService
  ) {}

  @Post('search')
  async search(
    @Req() req: Request,
    @Body() searchOptions: SearchOptions<WithId<Person>>
  ): Promise<ListResult<Person>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.search(context, {
      limit: searchOptions.limit,
      offset: searchOptions.offset,
      filter:
        searchOptions.filter === undefined
          ? undefined
          : personFilterFromRest(searchOptions.filter),
      order: searchOptions.order,
    });

    return {
      items: res.items.map((r) => personToRest(r)),
      total: res.total,
    };
  }

  @Get(':id')
  async get(
    @Req() req: Request,
    @Path() id: string
  ): Promise<(WithId<Person> | null)[]> {
    const context = await this.contextManager.get(req);

    const res = await this.service.get(context, id.split(','));

    return res.map((r) => (r === null ? null : personToRest(r)));
  }

  @Post('')
  async create(
    @Req() req: Request,
    @Body() data: Person
  ): Promise<WithId<Person>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.create(context, personFromRest(data));

    return personToRest(res);
  }

  @Patch(':id')
  async update(
    @Req() req: Request,
    @Path() id: string,
    @Body() data: Partial<Person>,
    @Query() ifRev?: string
  ): Promise<WithId<Person>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.update(context, id, personFromRest(data), {
      ifRev,
    });

    return personToRest(res);
  }

  @Delete(':id')
  async delete(
    @Req() req: Request,
    @Path() id: string,
    @Query() ifRev?: string
  ): Promise<WithId<Person>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.delete(context, id, { ifRev });

    return personToRest(res);
  }
}

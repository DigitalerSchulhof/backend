import { PersonService } from '#/services/person';
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
  personFilterFromRest,
  personFromRest,
  personToRest,
} from '../converters/person';
import {
  ListResult,
  Req,
  RestContextManager,
  SearchOptions,
  WithId,
} from './base';
import { restControllerTokens } from './tokens';

export type Person = {
  firstname: string;
  lastname: string;
  type: PersonType;
  gender: PersonGender;
  teacherCode: string | null;
  accountId: string | null;
};

export type PersonType = 'student' | 'teacher' | 'parent' | 'admin' | 'other';

export type PersonGender = 'male' | 'female' | 'other';

@Route('persons')
@Tags('Person')
export class RestPersonController extends Controller {
  constructor(
    private readonly contextManager: RestContextManager,
    private readonly service: PersonService
  ) {
    super();
  }

  static readonly inject = tokens(
    'contextManager',
    serviceTokens.personService
  );

  static readonly key = restControllerTokens.personController;

  @Post('search')
  async search(
    @Request() req: Req,
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

  @Get(':ids')
  async get(
    @Request() req: Req,
    @Path() ids: string
  ): Promise<(WithId<Person> | null)[]> {
    const context = await this.contextManager.get(req);

    const res = await this.service.get(context, ids.split(','));

    return res.map((r) => (r === null ? null : personToRest(r)));
  }

  @Post('')
  async create(
    @Request() req: Req,
    @Body() data: Person
  ): Promise<WithId<Person>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.create(context, personFromRest(data));

    return personToRest(res);
  }

  @Patch(':id')
  async update(
    @Request() req: Req,
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
    @Request() req: Req,
    @Path() id: string,
    @Query() ifRev?: string
  ): Promise<WithId<Person>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.delete(context, id, { ifRev });

    return personToRest(res);
  }
}

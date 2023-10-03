import { ListResult, SearchOptions } from '#/models/base';
import { IdentityTheftService } from '#/services/identity-theft';
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
  identityTheftFilterFromRest,
  identityTheftFromRest,
  identityTheftToRest,
} from '../converters/identity-theft';
import { WithId } from '../models/base';
import { IdentityTheft } from '../models/identity-theft';
import { RestContextManager } from './base';

@Route('identity-thefts')
@Tags('Identity Theft')
export class RestIdentityTheftController {
  constructor(
    private readonly contextManager: RestContextManager,
    private readonly service: IdentityTheftService
  ) {}

  @Post('search')
  async search(
    @Req() req: Request,
    @Body() searchOptions: SearchOptions<WithId<IdentityTheft>>
  ): Promise<ListResult<IdentityTheft>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.search(context, {
      limit: searchOptions.limit,
      offset: searchOptions.offset,
      filter:
        searchOptions.filter === undefined
          ? undefined
          : identityTheftFilterFromRest(searchOptions.filter),
      order: searchOptions.order,
    });

    return {
      items: res.items.map((r) => identityTheftToRest(r)),
      total: res.total,
    };
  }

  @Get(':id')
  async get(
    @Req() req: Request,
    @Path() id: string
  ): Promise<(WithId<IdentityTheft> | null)[]> {
    const context = await this.contextManager.get(req);

    const res = await this.service.get(context, id.split(','));

    return res.map((r) => (r === null ? null : identityTheftToRest(r)));
  }

  @Post('')
  async create(
    @Req() req: Request,
    @Body() data: IdentityTheft
  ): Promise<WithId<IdentityTheft>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.create(context, identityTheftFromRest(data));

    return identityTheftToRest(res);
  }

  @Patch(':id')
  async update(
    @Req() req: Request,
    @Path() id: string,
    @Body() data: Partial<IdentityTheft>,
    @Query() ifRev?: string
  ): Promise<WithId<IdentityTheft>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.update(
      context,
      id,
      identityTheftFromRest(data),
      {
        ifRev,
      }
    );

    return identityTheftToRest(res);
  }

  @Delete(':id')
  async delete(
    @Req() req: Request,
    @Path() id: string,
    @Query() ifRev?: string
  ): Promise<WithId<IdentityTheft>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.delete(context, id, { ifRev });

    return identityTheftToRest(res);
  }
}

import { ListResult, SearchOptions, TypeFilter, WithId } from '#/models/base';
import * as js from '#/models/identity-theft';
import { IdentityTheftRepository } from '#/repositories/interfaces/identity-theft';
import {
  identityTheftFilterToArango,
  identityTheftFromArango,
  identityTheftToArango,
} from '../converters/identity-theft';
import { ArangoIdentityTheftRepository } from '../repositories/identity-theft';

export class ArangoIdentityTheftRepositoryAdapter
  implements IdentityTheftRepository
{
  constructor(private readonly repository: ArangoIdentityTheftRepository) {}

  async search(
    options: SearchOptions<js.IdentityTheft>
  ): Promise<ListResult<WithId<js.IdentityTheft>>> {
    const res = await this.repository.search({
      limit: options.limit,
      offset: options.offset,
      filter:
        options.filter === undefined
          ? undefined
          : identityTheftFilterToArango(options.filter),
      order: options.order,
    });

    return {
      items: res.items.map((r) => identityTheftFromArango(r)),
      total: res.total,
    };
  }

  async get(
    ids: readonly string[]
  ): Promise<(WithId<js.IdentityTheft> | null)[]> {
    const res = await this.repository.get(ids);

    return res.map((r) => (r === null ? null : identityTheftFromArango(r)));
  }

  async create(data: js.IdentityTheft): Promise<WithId<js.IdentityTheft>> {
    const res = await this.repository.create(identityTheftToArango(data));

    return identityTheftFromArango(res);
  }

  async update(
    id: string,
    data: Partial<js.IdentityTheft>,
    options?: { ifRev?: string }
  ): Promise<WithId<js.IdentityTheft>> {
    const res = await this.repository.update(
      id,
      identityTheftToArango(data),
      options?.ifRev
    );

    return identityTheftFromArango(res);
  }

  async updateWhere(
    filter: TypeFilter<js.IdentityTheft>,
    data: Partial<js.IdentityTheft>
  ): Promise<number> {
    const res = await this.repository.updateWhere(
      identityTheftFilterToArango(filter),
      identityTheftToArango(data)
    );

    return res;
  }

  async delete(
    id: string,
    options?: { ifRev?: string }
  ): Promise<WithId<js.IdentityTheft>> {
    const res = await this.repository.delete(id, options?.ifRev);

    return identityTheftFromArango(res);
  }

  async deleteWhere(filter: TypeFilter<js.IdentityTheft>): Promise<number> {
    const res = await this.repository.deleteWhere(
      identityTheftFilterToArango(filter)
    );

    return res;
  }
}

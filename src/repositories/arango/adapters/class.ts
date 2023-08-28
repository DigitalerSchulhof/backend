import { ClassRepository } from '#/repositories/interfaces/class';
import { ListResult, SearchOptions, TypeFilter, WithId } from '#/services/base';
import * as js from '#/services/class';
import { tokens } from 'typed-inject';
import {
  classFilterToArango,
  classFromArango,
  classToArango,
} from '../converters/class';
import { ArangoClassRepository } from '../services/class';
import { arangoRepositoryTokens } from '../tokens';

export class ArangoClassRepositoryAdapter implements ClassRepository {
  constructor(private readonly repository: ArangoClassRepository) {}

  static readonly inject = tokens(arangoRepositoryTokens.classRepository);

  async search(
    options: SearchOptions<js.Class>
  ): Promise<ListResult<WithId<js.Class>>> {
    const res = await this.repository.search({
      limit: options.limit,
      offset: options.offset,
      filter:
        options.filter === undefined
          ? undefined
          : classFilterToArango(options.filter),
      order: options.order,
    });

    return {
      items: res.items.map((r) => classFromArango(r)),
      total: res.total,
    };
  }

  async get(ids: readonly string[]): Promise<(WithId<js.Class> | null)[]> {
    const res = await this.repository.get(ids);

    return res.map((r) => (r === null ? null : classFromArango(r)));
  }

  async create(data: js.Class): Promise<WithId<js.Class>> {
    const res = await this.repository.create(classToArango(data));

    return classFromArango(res);
  }

  async update(
    id: string,
    data: Partial<js.Class>,
    options?: { ifRev?: string }
  ): Promise<WithId<js.Class>> {
    const res = await this.repository.update(
      id,
      classToArango(data),
      options?.ifRev
    );

    return classFromArango(res);
  }

  async updateWhere(
    filter: TypeFilter<js.Class>,
    data: Partial<js.Class>
  ): Promise<number> {
    const res = await this.repository.updateWhere(
      classFilterToArango(filter),
      classToArango(data)
    );

    return res;
  }

  async delete(
    id: string,
    options?: { ifRev?: string }
  ): Promise<WithId<js.Class>> {
    const res = await this.repository.delete(id, options?.ifRev);

    return classFromArango(res);
  }

  async deleteWhere(filter: TypeFilter<js.Class>): Promise<number> {
    const res = await this.repository.deleteWhere(classFilterToArango(filter));

    return res;
  }
}

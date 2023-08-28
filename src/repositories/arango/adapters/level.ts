import { LevelRepository } from '#/repositories/interfaces/level';
import { ListResult, SearchOptions, TypeFilter, WithId } from '#/services/base';
import * as js from '#/services/level';
import { tokens } from 'typed-inject';
import {
  levelFilterToArango,
  levelFromArango,
  levelToArango,
} from '../converters/level';
import { ArangoLevelRepository } from '../services/level';
import { arangoRepositoryTokens } from '../tokens';

export class ArangoLevelRepositoryAdapter implements LevelRepository {
  constructor(private readonly repository: ArangoLevelRepository) {}

  static readonly inject = tokens(arangoRepositoryTokens.levelRepository);

  async search(
    options: SearchOptions<js.Level>
  ): Promise<ListResult<WithId<js.Level>>> {
    const res = await this.repository.search({
      limit: options.limit,
      offset: options.offset,
      filter:
        options.filter === undefined
          ? undefined
          : levelFilterToArango(options.filter),
      order: options.order,
    });

    return {
      items: res.items.map((r) => levelFromArango(r)),
      total: res.total,
    };
  }

  async get(ids: readonly string[]): Promise<(WithId<js.Level> | null)[]> {
    const res = await this.repository.get(ids);

    return res.map((r) => (r === null ? null : levelFromArango(r)));
  }

  async create(data: js.Level): Promise<WithId<js.Level>> {
    const res = await this.repository.create(levelToArango(data));

    return levelFromArango(res);
  }

  async update(
    id: string,
    data: Partial<js.Level>,
    options?: { ifRev?: string }
  ): Promise<WithId<js.Level>> {
    const res = await this.repository.update(
      id,
      levelToArango(data),
      options?.ifRev
    );

    return levelFromArango(res);
  }

  async updateWhere(
    filter: TypeFilter<js.Level>,
    data: Partial<js.Level>
  ): Promise<number> {
    const res = await this.repository.updateWhere(
      levelFilterToArango(filter),
      levelToArango(data)
    );

    return res;
  }

  async delete(
    id: string,
    options?: { ifRev?: string }
  ): Promise<WithId<js.Level>> {
    const res = await this.repository.delete(id, options?.ifRev);

    return levelFromArango(res);
  }

  async deleteWhere(filter: TypeFilter<js.Level>): Promise<number> {
    const res = await this.repository.deleteWhere(levelFilterToArango(filter));

    return res;
  }
}

import { SessionRepository } from '#/repositories/interfaces/session';
import { ListResult, SearchOptions, TypeFilter, WithId } from '#/services/base';
import * as js from '#/services/session';
import { tokens } from 'typed-inject';
import {
  sessionFilterToArango,
  sessionFromArango,
  sessionToArango,
} from '../converters/session';
import { ArangoSessionRepository } from '../services/session';
import { arangoRepositoryTokens } from '../tokens';

export class ArangoSessionRepositoryAdapter implements SessionRepository {
  constructor(private readonly repository: ArangoSessionRepository) {}

  static readonly inject = tokens(arangoRepositoryTokens.sessionRepository);

  async search(
    options: SearchOptions<js.Session>
  ): Promise<ListResult<WithId<js.Session>>> {
    const res = await this.repository.search({
      limit: options.limit,
      offset: options.offset,
      filter:
        options.filter === undefined
          ? undefined
          : sessionFilterToArango(options.filter),
      order: options.order,
    });

    return {
      items: res.items.map((r) => sessionFromArango(r)),
      total: res.total,
    };
  }

  async get(ids: readonly string[]): Promise<(WithId<js.Session> | null)[]> {
    const res = await this.repository.get(ids);

    return res.map((r) => (r === null ? null : sessionFromArango(r)));
  }

  async create(data: js.Session): Promise<WithId<js.Session>> {
    const res = await this.repository.create(sessionToArango(data));

    return sessionFromArango(res);
  }

  async update(
    id: string,
    data: Partial<js.Session>,
    options?: { ifRev?: string }
  ): Promise<WithId<js.Session>> {
    const res = await this.repository.update(
      id,
      sessionToArango(data),
      options?.ifRev
    );

    return sessionFromArango(res);
  }

  async updateWhere(
    filter: TypeFilter<js.Session>,
    data: Partial<js.Session>
  ): Promise<number> {
    const res = await this.repository.updateWhere(
      sessionFilterToArango(filter),
      sessionToArango(data)
    );

    return res;
  }

  async delete(
    id: string,
    options?: { ifRev?: string }
  ): Promise<WithId<js.Session>> {
    const res = await this.repository.delete(id, options?.ifRev);

    return sessionFromArango(res);
  }

  async deleteWhere(filter: TypeFilter<js.Session>): Promise<number> {
    const res = await this.repository.deleteWhere(
      sessionFilterToArango(filter)
    );

    return res;
  }
}

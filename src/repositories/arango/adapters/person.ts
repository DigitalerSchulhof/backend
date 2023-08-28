import { PersonRepository } from '#/repositories/interfaces/person';
import { ListResult, SearchOptions, TypeFilter, WithId } from '#/services/base';
import * as js from '#/services/person';
import { tokens } from 'typed-inject';
import {
  personFilterToArango,
  personFromArango,
  personToArango,
} from '../converters/person';
import { ArangoPersonRepository } from '../services/person';
import { arangoRepositoryTokens } from '../tokens';

export class ArangoPersonRepositoryAdapter implements PersonRepository {
  constructor(private readonly repository: ArangoPersonRepository) {}

  static readonly inject = tokens(arangoRepositoryTokens.personRepository);

  async search(
    options: SearchOptions<js.Person>
  ): Promise<ListResult<WithId<js.Person>>> {
    const res = await this.repository.search({
      limit: options.limit,
      offset: options.offset,
      filter:
        options.filter === undefined
          ? undefined
          : personFilterToArango(options.filter),
      order: options.order,
    });

    return {
      items: res.items.map((r) => personFromArango(r)),
      total: res.total,
    };
  }

  async get(ids: readonly string[]): Promise<(WithId<js.Person> | null)[]> {
    const res = await this.repository.get(ids);

    return res.map((r) => (r === null ? null : personFromArango(r)));
  }

  async create(data: js.Person): Promise<WithId<js.Person>> {
    const res = await this.repository.create(personToArango(data));

    return personFromArango(res);
  }

  async update(
    id: string,
    data: Partial<js.Person>,
    options?: { ifRev?: string }
  ): Promise<WithId<js.Person>> {
    const res = await this.repository.update(
      id,
      personToArango(data),
      options?.ifRev
    );

    return personFromArango(res);
  }

  async updateWhere(
    filter: TypeFilter<js.Person>,
    data: Partial<js.Person>
  ): Promise<number> {
    const res = await this.repository.updateWhere(
      personFilterToArango(filter),
      personToArango(data)
    );

    return res;
  }

  async delete(
    id: string,
    options?: { ifRev?: string }
  ): Promise<WithId<js.Person>> {
    const res = await this.repository.delete(id, options?.ifRev);

    return personFromArango(res);
  }

  async deleteWhere(filter: TypeFilter<js.Person>): Promise<number> {
    const res = await this.repository.deleteWhere(personFilterToArango(filter));

    return res;
  }
}

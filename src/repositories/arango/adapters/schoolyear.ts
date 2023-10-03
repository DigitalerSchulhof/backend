import { ListResult, SearchOptions, TypeFilter, WithId } from '#/models/base';
import * as js from '#/models/schoolyear';
import { SchoolyearRepository } from '#/repositories/interfaces/schoolyear';
import {
  schoolyearFilterToArango,
  schoolyearFromArango,
  schoolyearToArango,
} from '../converters/schoolyear';
import { ArangoSchoolyearRepository } from '../repositories/schoolyear';

export class ArangoSchoolyearRepositoryAdapter implements SchoolyearRepository {
  constructor(private readonly repository: ArangoSchoolyearRepository) {}

  async search(
    options: SearchOptions<js.Schoolyear>
  ): Promise<ListResult<WithId<js.Schoolyear>>> {
    const res = await this.repository.search({
      limit: options.limit,
      offset: options.offset,
      filter:
        options.filter === undefined
          ? undefined
          : schoolyearFilterToArango(options.filter),
      order: options.order,
    });

    return {
      items: res.items.map((r) => schoolyearFromArango(r)),
      total: res.total,
    };
  }

  async get(ids: readonly string[]): Promise<(WithId<js.Schoolyear> | null)[]> {
    const res = await this.repository.get(ids);

    return res.map((r) => (r === null ? null : schoolyearFromArango(r)));
  }

  async create(data: js.Schoolyear): Promise<WithId<js.Schoolyear>> {
    const res = await this.repository.create(schoolyearToArango(data));

    return schoolyearFromArango(res);
  }

  async update(
    id: string,
    data: Partial<js.Schoolyear>,
    options?: { ifRev?: string }
  ): Promise<WithId<js.Schoolyear>> {
    const res = await this.repository.update(
      id,
      schoolyearToArango(data),
      options?.ifRev
    );

    return schoolyearFromArango(res);
  }

  async updateWhere(
    filter: TypeFilter<js.Schoolyear>,
    data: Partial<js.Schoolyear>
  ): Promise<number> {
    const res = await this.repository.updateWhere(
      schoolyearFilterToArango(filter),
      schoolyearToArango(data)
    );

    return res;
  }

  async delete(
    id: string,
    options?: { ifRev?: string }
  ): Promise<WithId<js.Schoolyear>> {
    const res = await this.repository.delete(id, options?.ifRev);

    return schoolyearFromArango(res);
  }

  async deleteWhere(filter: TypeFilter<js.Schoolyear>): Promise<number> {
    const res = await this.repository.deleteWhere(
      schoolyearFilterToArango(filter)
    );

    return res;
  }
}

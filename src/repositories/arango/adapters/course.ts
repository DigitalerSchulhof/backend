import { CourseRepository } from '#/repositories/interfaces/course';
import { ListResult, SearchOptions, TypeFilter, WithId } from '#/services/base';
import * as js from '#/services/course';
import { tokens } from 'typed-inject';
import {
  courseFilterToArango,
  courseFromArango,
  courseToArango,
} from '../converters/course';
import { ArangoCourseRepository } from '../services/course';
import { arangoRepositoryTokens } from '../tokens';

export class ArangoCourseRepositoryAdapter implements CourseRepository {
  constructor(private readonly repository: ArangoCourseRepository) {}

  static readonly inject = tokens(arangoRepositoryTokens.courseRepository);

  async search(
    options: SearchOptions<js.Course>
  ): Promise<ListResult<WithId<js.Course>>> {
    const res = await this.repository.search({
      limit: options.limit,
      offset: options.offset,
      filter:
        options.filter === undefined
          ? undefined
          : courseFilterToArango(options.filter),
      order: options.order,
    });

    return {
      items: res.items.map((r) => courseFromArango(r)),
      total: res.total,
    };
  }

  async get(ids: readonly string[]): Promise<(WithId<js.Course> | null)[]> {
    const res = await this.repository.get(ids);

    return res.map((r) => (r === null ? null : courseFromArango(r)));
  }

  async create(data: js.Course): Promise<WithId<js.Course>> {
    const res = await this.repository.create(courseToArango(data));

    return courseFromArango(res);
  }

  async update(
    id: string,
    data: Partial<js.Course>,
    options?: { ifRev?: string }
  ): Promise<WithId<js.Course>> {
    const res = await this.repository.update(
      id,
      courseToArango(data),
      options?.ifRev
    );

    return courseFromArango(res);
  }

  async updateWhere(
    filter: TypeFilter<js.Course>,
    data: Partial<js.Course>
  ): Promise<number> {
    const res = await this.repository.updateWhere(
      courseFilterToArango(filter),
      courseToArango(data)
    );

    return res;
  }

  async delete(
    id: string,
    options?: { ifRev?: string }
  ): Promise<WithId<js.Course>> {
    const res = await this.repository.delete(id, options?.ifRev);

    return courseFromArango(res);
  }

  async deleteWhere(filter: TypeFilter<js.Course>): Promise<number> {
    const res = await this.repository.deleteWhere(courseFilterToArango(filter));

    return res;
  }
}

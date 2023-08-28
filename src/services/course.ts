import { CoursePermissionHandler } from '#/permissions/course';
import { permissionHandlerTokens } from '#/permissions/tokens';
import { CourseRepository } from '#/repositories/interfaces/course';
import { repositoryTokens } from '#/repositories/tokens';
import { CourseValidator } from '#/validators/course';
import { validatorTokens } from '#/validators/tokens';
import { tokens } from 'typed-inject';
import {
  BaseService,
  ListResult,
  RequestContext,
  SearchOptions,
  TypeFilter,
  WithId,
} from './base';

export type Course = {
  name: string;
  classId: string;
};

export class CourseService extends BaseService<Course> {
  constructor(
    private readonly repository: CourseRepository,
    private readonly validator: CourseValidator,
    private readonly permissionHandler: CoursePermissionHandler
  ) {
    super();
  }

  static readonly inject = tokens(
    repositoryTokens.courseRepository,
    validatorTokens.courseValidator,
    permissionHandlerTokens.coursePermissionHandler
  );

  override async search(
    context: RequestContext,
    options: SearchOptions<WithId<Course>>
  ): Promise<ListResult<WithId<Course>>> {
    await this.permissionHandler.assertMaySearch(context);

    return this.repository.search(options);
  }

  override async get(
    context: RequestContext,
    ids: readonly string[]
  ): Promise<(WithId<Course> | null)[]> {
    await this.permissionHandler.assertMayGet(context, ids);

    return this.repository.get(ids);
  }

  override async create(
    context: RequestContext,
    data: Course
  ): Promise<WithId<Course>> {
    await this.permissionHandler.assertMayCreate(context, data);
    await this.validator.assertCanCreate(data);

    return this.repository.create(data);
  }

  override async update(
    context: RequestContext,
    id: string,
    data: Partial<Course>,
    options?: { ifRev?: string }
  ): Promise<WithId<Course>> {
    await this.permissionHandler.assertMayUpdate(context, id, data);
    await this.validator.assertCanUpdate(id, data);

    return this.repository.update(id, data, options);
  }

  override updateWhere(
    filter: TypeFilter<Course>,
    data: Partial<Course>
  ): Promise<number> {
    return this.repository.updateWhere(filter, data);
  }

  override async delete(
    context: RequestContext,
    id: string,
    options?: { ifRev?: string }
  ): Promise<WithId<Course>> {
    await this.permissionHandler.assertMayDelete(context, id);

    return this.repository.delete(id, options);
  }

  override async deleteWhere(filter: TypeFilter<Course>): Promise<number> {
    return this.repository.deleteWhere(filter);
  }
}

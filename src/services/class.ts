import { ListResult, SearchOptions, TypeFilter, WithId } from '#/models/base';
import { Class } from '#/models/class';
import { ClassPermissionHandler } from '#/permissions/class';
import { ClassRepository } from '#/repositories/interfaces/class';
import { ClassValidator } from '#/validators/class';
import { BaseService, RequestContext } from './base';

export class ClassService extends BaseService<Class> {
  constructor(
    private readonly repository: ClassRepository,
    private readonly validator: ClassValidator,
    private readonly permissionHandler: ClassPermissionHandler
  ) {
    super();
  }

  override async search(
    context: RequestContext,
    options: SearchOptions<WithId<Class>>
  ): Promise<ListResult<WithId<Class>>> {
    await this.permissionHandler.assertMaySearch(context);

    return this.repository.search(options);
  }

  override async get(
    context: RequestContext,
    ids: readonly string[]
  ): Promise<(WithId<Class> | null)[]> {
    await this.permissionHandler.assertMayGet(context, ids);

    return this.repository.get(ids);
  }

  override async create(
    context: RequestContext,
    data: Class
  ): Promise<WithId<Class>> {
    await this.permissionHandler.assertMayCreate(context, data);
    await this.validator.assertCanCreate(data);

    return this.repository.create(data);
  }

  override async update(
    context: RequestContext,
    id: string,
    data: Partial<Class>,
    options?: { ifRev?: string }
  ): Promise<WithId<Class>> {
    await this.permissionHandler.assertMayUpdate(context, id, data);
    await this.validator.assertCanUpdate(id, data);

    return this.repository.update(id, data, options);
  }

  override async updateWhere(
    filter: TypeFilter<Class>,
    data: Partial<Class>
  ): Promise<number> {
    return this.repository.updateWhere(filter, data);
  }

  override async delete(
    context: RequestContext,
    id: string,
    options?: { ifRev?: string }
  ): Promise<WithId<Class>> {
    await this.permissionHandler.assertMayDelete(context, id);

    return this.repository.delete(id, options);
  }

  override async deleteWhere(filter: TypeFilter<Class>): Promise<number> {
    return this.repository.deleteWhere(filter);
  }
}

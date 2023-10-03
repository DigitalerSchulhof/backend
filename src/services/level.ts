import { ListResult, SearchOptions, TypeFilter, WithId } from '#/models/base';
import { Level } from '#/models/level';
import { LevelPermissionHandler } from '#/permissions/level';
import { LevelRepository } from '#/repositories/interfaces/level';
import { LevelValidator } from '#/validators/level';
import { BaseService, RequestContext } from './base';

export class LevelService extends BaseService<Level> {
  constructor(
    private readonly repository: LevelRepository,
    private readonly validator: LevelValidator,
    private readonly permissionHandler: LevelPermissionHandler
  ) {
    super();
  }

  override async search(
    context: RequestContext,
    options: SearchOptions<WithId<Level>>
  ): Promise<ListResult<WithId<Level>>> {
    await this.permissionHandler.assertMaySearch(context);

    return this.repository.search(options);
  }

  override async get(
    context: RequestContext,
    ids: readonly string[]
  ): Promise<(WithId<Level> | null)[]> {
    await this.permissionHandler.assertMayGet(context, ids);

    return this.repository.get(ids);
  }

  override async create(
    context: RequestContext,
    data: Level
  ): Promise<WithId<Level>> {
    await this.permissionHandler.assertMayCreate(context, data);
    await this.validator.assertCanCreate(data);

    return this.repository.create(data);
  }

  override async update(
    context: RequestContext,
    id: string,
    data: Partial<Level>,
    options?: { ifRev?: string }
  ): Promise<WithId<Level>> {
    await this.permissionHandler.assertMayUpdate(context, id, data);
    await this.validator.assertCanUpdate(id, data);

    return this.repository.update(id, data, options);
  }

  override updateWhere(
    filter: TypeFilter<Level>,
    data: Partial<Level>
  ): Promise<number> {
    return this.repository.updateWhere(filter, data);
  }

  override async delete(
    context: RequestContext,
    id: string,
    options?: { ifRev?: string }
  ): Promise<WithId<Level>> {
    await this.permissionHandler.assertMayDelete(context, id);

    return this.repository.delete(id, options);
  }

  override async deleteWhere(filter: TypeFilter<Level>): Promise<number> {
    return this.repository.deleteWhere(filter);
  }
}

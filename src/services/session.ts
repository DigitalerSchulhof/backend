import { ListResult, SearchOptions, TypeFilter, WithId } from '#/models/base';
import { Session } from '#/models/session';
import { SessionPermissionHandler } from '#/permissions/session';
import { SessionRepository } from '#/repositories/interfaces/session';
import { SessionValidator } from '#/validators/session';
import { BaseService, RequestContext } from './base';

export class SessionService extends BaseService<Session> {
  constructor(
    private readonly repository: SessionRepository,
    private readonly validator: SessionValidator,
    private readonly permissionHandler: SessionPermissionHandler
  ) {
    super();
  }

  override async search(
    context: RequestContext,
    options: SearchOptions<WithId<Session>>
  ): Promise<ListResult<WithId<Session>>> {
    await this.permissionHandler.assertMaySearch(context);

    return this.repository.search(options);
  }

  override async get(
    context: RequestContext,
    ids: readonly string[]
  ): Promise<(WithId<Session> | null)[]> {
    await this.permissionHandler.assertMayGet(context, ids);

    return this.repository.get(ids);
  }

  override async create(
    context: RequestContext,
    data: Session
  ): Promise<WithId<Session>> {
    await this.permissionHandler.assertMayCreate(context, data);
    await this.validator.assertCanCreate(data);

    return this.repository.create(data);
  }

  override async update(
    context: RequestContext,
    id: string,
    data: Partial<Session>,
    options?: { ifRev?: string }
  ): Promise<WithId<Session>> {
    await this.permissionHandler.assertMayUpdate(context, id, data);
    await this.validator.assertCanUpdate(id, data);

    return this.repository.update(id, data, options);
  }

  override updateWhere(
    filter: TypeFilter<Session>,
    data: Partial<Session>
  ): Promise<number> {
    return this.repository.updateWhere(filter, data);
  }

  override async delete(
    context: RequestContext,
    id: string,
    options?: { ifRev?: string }
  ): Promise<WithId<Session>> {
    await this.permissionHandler.assertMayDelete(context, id);

    return this.repository.delete(id, options);
  }

  override async deleteWhere(filter: TypeFilter<Session>): Promise<number> {
    return this.repository.deleteWhere(filter);
  }
}

import { SchoolyearPermissionHandler } from '#/permissions/schoolyear';
import { permissionHandlerTokens } from '#/permissions/tokens';
import { SchoolyearRepository } from '#/repositories/interfaces/schoolyear';
import { repositoryTokens } from '#/repositories/tokens';
import { SchoolyearValidator } from '#/validators/schoolyear';
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

export type Schoolyear = {
  name: string;
  start: Date;
  end: Date;
};

export class SchoolyearService extends BaseService<Schoolyear> {
  constructor(
    private readonly repository: SchoolyearRepository,
    private readonly validator: SchoolyearValidator,
    private readonly permissionHandler: SchoolyearPermissionHandler
  ) {
    super();
  }

  static readonly inject = tokens(
    repositoryTokens.schoolyearRepository,
    validatorTokens.schoolyearValidator,
    permissionHandlerTokens.schoolyearPermissionHandler
  );

  override async search(
    context: RequestContext,
    options: SearchOptions<WithId<Schoolyear>>
  ): Promise<ListResult<WithId<Schoolyear>>> {
    await this.permissionHandler.assertMaySearch(context);

    return this.repository.search(options);
  }

  override async get(
    context: RequestContext,
    ids: readonly string[]
  ): Promise<(WithId<Schoolyear> | null)[]> {
    await this.permissionHandler.assertMayGet(context, ids);

    return this.repository.get(ids);
  }

  override async create(
    context: RequestContext,
    data: Schoolyear
  ): Promise<WithId<Schoolyear>> {
    await this.permissionHandler.assertMayCreate(context, data);
    await this.validator.assertCanCreate(data);

    return this.repository.create(data);
  }

  override async update(
    context: RequestContext,
    id: string,
    data: Partial<Schoolyear>,
    options?: { ifRev?: string }
  ): Promise<WithId<Schoolyear>> {
    await this.permissionHandler.assertMayUpdate(context, id, data);
    await this.validator.assertCanUpdate(id, data);

    return this.repository.update(id, data, options);
  }

  override updateWhere(
    filter: TypeFilter<Schoolyear>,
    data: Partial<Schoolyear>
  ): Promise<number> {
    return this.repository.updateWhere(filter, data);
  }

  override async delete(
    context: RequestContext,
    id: string,
    options?: { ifRev?: string }
  ): Promise<WithId<Schoolyear>> {
    await this.permissionHandler.assertMayDelete(context, id);

    return this.repository.delete(id, options);
  }

  override async deleteWhere(filter: TypeFilter<Schoolyear>): Promise<number> {
    return this.repository.deleteWhere(filter);
  }
}

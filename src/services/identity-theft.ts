import { IdentityTheftPermissionHandler } from '#/permissions/identity-theft';
import { permissionHandlerTokens } from '#/permissions/tokens';
import { IdentityTheftRepository } from '#/repositories/interfaces/identity-theft';
import { repositoryTokens } from '#/repositories/tokens';
import { IdentityTheftValidator } from '#/validators/identity-theft';
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

export type IdentityTheft = {
  personId: string;
  reportedAt: Date;
};

export class IdentityTheftService extends BaseService<IdentityTheft> {
  constructor(
    private readonly repository: IdentityTheftRepository,
    private readonly validator: IdentityTheftValidator,
    private readonly permissionHandler: IdentityTheftPermissionHandler
  ) {
    super();
  }

  static readonly inject = tokens(
    repositoryTokens.identityTheftRepository,
    validatorTokens.identityTheftValidator,
    permissionHandlerTokens.identityTheftPermissionHandler
  );

  override async search(
    context: RequestContext,
    options: SearchOptions<WithId<IdentityTheft>>
  ): Promise<ListResult<WithId<IdentityTheft>>> {
    await this.permissionHandler.assertMaySearch(context);

    return this.repository.search(options);
  }

  override async get(
    context: RequestContext,
    ids: readonly string[]
  ): Promise<(WithId<IdentityTheft> | null)[]> {
    await this.permissionHandler.assertMayGet(context, ids);

    return this.repository.get(ids);
  }

  override async create(
    context: RequestContext,
    data: IdentityTheft
  ): Promise<WithId<IdentityTheft>> {
    await this.permissionHandler.assertMayCreate(context, data);
    await this.validator.assertCanCreate(data);

    return this.repository.create(data);
  }

  override async update(
    context: RequestContext,
    id: string,
    data: Partial<IdentityTheft>,
    options?: { ifRev?: string }
  ): Promise<WithId<IdentityTheft>> {
    await this.permissionHandler.assertMayUpdate(context, id, data);
    await this.validator.assertCanUpdate(id, data);

    return this.repository.update(id, data, options);
  }

  override updateWhere(
    filter: TypeFilter<IdentityTheft>,
    data: Partial<IdentityTheft>
  ): Promise<number> {
    return this.repository.updateWhere(filter, data);
  }

  override async delete(
    context: RequestContext,
    id: string,
    options?: { ifRev?: string }
  ): Promise<WithId<IdentityTheft>> {
    await this.permissionHandler.assertMayDelete(context, id);

    return this.repository.delete(id, options);
  }

  override async deleteWhere(
    filter: TypeFilter<IdentityTheft>
  ): Promise<number> {
    return this.repository.deleteWhere(filter);
  }
}

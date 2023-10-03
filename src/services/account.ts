import { Account } from '#/models/account';
import { ListResult, SearchOptions, TypeFilter, WithId } from '#/models/base';
import { AccountPermissionHandler } from '#/permissions/account';
import { AccountRepository } from '#/repositories/interfaces/account';
import { AccountValidator } from '#/validators/account';
import { BaseService, RequestContext } from './base';

export class AccountService extends BaseService<Account> {
  constructor(
    private readonly repository: AccountRepository,
    private readonly validator: AccountValidator,
    private readonly permissionHandler: AccountPermissionHandler
  ) {
    super();
  }

  override async search(
    context: RequestContext,
    options: SearchOptions<WithId<Account>>
  ): Promise<ListResult<WithId<Account>>> {
    await this.permissionHandler.assertMaySearch(context);

    return this.repository.search(options);
  }

  override async get(
    context: RequestContext,
    ids: readonly string[]
  ): Promise<(WithId<Account> | null)[]> {
    await this.permissionHandler.assertMayGet(context, ids);

    return this.repository.get(ids);
  }

  override async create(
    context: RequestContext,
    data: Account,
    options?: {
      /**
       * Only creates the account if the person has the given rev.
       */
      ifPersonRev?: string;
    }
  ): Promise<WithId<Account>> {
    await this.permissionHandler.assertMayCreate(context, data);
    await this.validator.assertCanCreate(data);

    return this.repository.create(data, options);
  }

  override async update(
    context: RequestContext,
    id: string,
    data: Partial<Account>,
    options?: { ifRev?: string }
  ): Promise<WithId<Account>> {
    await this.permissionHandler.assertMayUpdate(context, id, data);
    await this.validator.assertCanUpdate(id, data);

    return this.repository.update(id, data, options);
  }

  override updateWhere(
    filter: TypeFilter<Account>,
    data: Partial<Account>
  ): Promise<number> {
    return this.repository.updateWhere(filter, data);
  }

  override async delete(
    context: RequestContext,
    id: string,
    options?: { ifRev?: string }
  ): Promise<WithId<Account>> {
    await this.permissionHandler.assertMayDelete(context, id);

    return this.repository.delete(id, options);
  }

  override async deleteWhere(filter: TypeFilter<Account>): Promise<number> {
    return this.repository.deleteWhere(filter);
  }
}

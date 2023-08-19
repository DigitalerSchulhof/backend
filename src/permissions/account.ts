import { Account } from '#/services/account';
import { RequestContext, SearchOptions } from '#/services/base';
import { BasePermissionHandler } from './base';

export class AccountPermissionHandler
  implements BasePermissionHandler<Account>
{
  // TODO: Implement

  async assertMaySearch(
    context: RequestContext,
    options?: SearchOptions<Account> | undefined
  ): Promise<void> {}

  async assertMayGet(
    context: RequestContext,
    ids: readonly string[]
  ): Promise<void> {}

  async assertMayCreate(
    context: RequestContext,
    data: Account
  ): Promise<void> {}

  async assertMayUpdate(
    context: RequestContext,
    id: string,
    data: Partial<Account>
  ): Promise<void> {}

  async assertMayUpdateMany(
    context: RequestContext,
    data: Partial<Account>
  ): Promise<void> {}

  async assertMayDelete(context: RequestContext, id: string): Promise<void> {}

  async assertMayDeleteMany(context: RequestContext): Promise<void> {}
}

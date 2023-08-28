import { RequestContext, SearchOptions } from '#/services/base';
import { IdentityTheft } from '#/services/identity-theft';
import { BasePermissionHandler } from './base';

export class IdentityTheftPermissionHandler
  implements BasePermissionHandler<IdentityTheft>
{
  // TODO: Implement

  async assertMaySearch(
    context: RequestContext,
    options?: SearchOptions<IdentityTheft> | undefined
  ): Promise<void> {}

  async assertMayGet(
    context: RequestContext,
    ids: readonly string[]
  ): Promise<void> {}

  async assertMayCreate(
    context: RequestContext,
    data: IdentityTheft
  ): Promise<void> {}

  async assertMayUpdate(
    context: RequestContext,
    id: string,
    data: Partial<IdentityTheft>
  ): Promise<void> {}

  async assertMayDelete(context: RequestContext, id: string): Promise<void> {}
}

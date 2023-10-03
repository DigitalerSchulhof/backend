import { SearchOptions } from '#/models/base';
import { RequestContext } from '#/services/base';

export abstract class BasePermissionHandler<Base extends object> {
  async assertMaySearch(
    context: RequestContext,
    options?: SearchOptions<Base>
  ): Promise<void> {}

  async assertMayGet(
    context: RequestContext,
    ids: readonly string[]
  ): Promise<void> {}

  async assertMayCreate(context: RequestContext, data: Base): Promise<void> {}

  async assertMayUpdate(
    context: RequestContext,
    id: string,
    data: Partial<Base>
  ): Promise<void> {}

  async assertMayDelete(context: RequestContext, id: string): Promise<void> {}
}

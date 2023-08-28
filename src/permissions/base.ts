import { RequestContext, SearchOptions } from '#/services/base';

export abstract class BasePermissionHandler<Base extends object> {
  abstract assertMaySearch(
    context: RequestContext,
    options?: SearchOptions<Base>
  ): Promise<void | never>;

  abstract assertMayGet(
    context: RequestContext,
    ids: readonly string[]
  ): Promise<void | never>;

  abstract assertMayCreate(
    context: RequestContext,
    data: Base
  ): Promise<void | never>;

  abstract assertMayUpdate(
    context: RequestContext,
    id: string,
    data: Partial<Base>
  ): Promise<void | never>;

  abstract assertMayDelete(
    context: RequestContext,
    id: string
  ): Promise<void | never>;
}

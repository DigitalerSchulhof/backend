import { SearchOptions } from '#/repositories/interfaces/base';
import { RequestContext } from '#/server';

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

  abstract assertMayUpdateMany(
    context: RequestContext,
    data: Partial<Base>
  ): Promise<void | never>;

  abstract assertMayDelete(
    context: RequestContext,
    id: string
  ): Promise<void | never>;

  abstract assertMayDeleteMany(context: RequestContext): Promise<void | never>;
}

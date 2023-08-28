import { RequestContext, SearchOptions } from '#/services/base';
import { Session } from '#/services/session';
import { BasePermissionHandler } from './base';

export class SessionPermissionHandler
  implements BasePermissionHandler<Session>
{
  // TODO: Implement

  async assertMaySearch(
    context: RequestContext,
    options?: SearchOptions<Session> | undefined
  ): Promise<void> {}

  async assertMayGet(
    context: RequestContext,
    ids: readonly string[]
  ): Promise<void> {}

  async assertMayCreate(
    context: RequestContext,
    data: Session
  ): Promise<void> {}

  async assertMayUpdate(
    context: RequestContext,
    id: string,
    data: Partial<Session>
  ): Promise<void> {}

  async assertMayDelete(context: RequestContext, id: string): Promise<void> {}
}

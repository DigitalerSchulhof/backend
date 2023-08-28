import { RequestContext, SearchOptions } from '#/services/base';
import { Schoolyear } from '#/services/schoolyear';
import { BasePermissionHandler } from './base';

export class SchoolyearPermissionHandler
  implements BasePermissionHandler<Schoolyear>
{
  // TODO: Implement

  async assertMaySearch(
    context: RequestContext,
    options?: SearchOptions<Schoolyear> | undefined
  ): Promise<void> {}

  async assertMayGet(
    context: RequestContext,
    ids: readonly string[]
  ): Promise<void> {}

  async assertMayCreate(
    context: RequestContext,
    data: Schoolyear
  ): Promise<void> {}

  async assertMayUpdate(
    context: RequestContext,
    id: string,
    data: Partial<Schoolyear>
  ): Promise<void> {}

  async assertMayDelete(context: RequestContext, id: string): Promise<void> {}
}

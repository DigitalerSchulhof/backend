import { RequestContext, SearchOptions } from '#/services/base';
import { Class } from '#/services/class';
import { BasePermissionHandler } from './base';

export class ClassPermissionHandler implements BasePermissionHandler<Class> {
  // TODO: Implement

  async assertMaySearch(
    context: RequestContext,
    options?: SearchOptions<Class> | undefined
  ): Promise<void> {}

  async assertMayGet(
    context: RequestContext,
    ids: readonly string[]
  ): Promise<void> {}

  async assertMayCreate(context: RequestContext, data: Class): Promise<void> {}

  async assertMayUpdate(
    context: RequestContext,
    id: string,
    data: Partial<Class>
  ): Promise<void> {}

  async assertMayDelete(context: RequestContext, id: string): Promise<void> {}
}

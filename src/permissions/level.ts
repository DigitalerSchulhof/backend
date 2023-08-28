import { RequestContext, SearchOptions } from '#/services/base';
import { Level } from '#/services/level';
import { BasePermissionHandler } from './base';

export class LevelPermissionHandler implements BasePermissionHandler<Level> {
  // TODO: Implement

  async assertMaySearch(
    context: RequestContext,
    options?: SearchOptions<Level> | undefined
  ): Promise<void> {}

  async assertMayGet(
    context: RequestContext,
    ids: readonly string[]
  ): Promise<void> {}

  async assertMayCreate(context: RequestContext, data: Level): Promise<void> {}

  async assertMayUpdate(
    context: RequestContext,
    id: string,
    data: Partial<Level>
  ): Promise<void> {}

  async assertMayDelete(context: RequestContext, id: string): Promise<void> {}
}

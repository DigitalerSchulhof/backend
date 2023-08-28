import { RequestContext, SearchOptions } from '#/services/base';
import { Course } from '#/services/course';
import { BasePermissionHandler } from './base';

export class CoursePermissionHandler implements BasePermissionHandler<Course> {
  // TODO: Implement

  async assertMaySearch(
    context: RequestContext,
    options?: SearchOptions<Course> | undefined
  ): Promise<void> {}

  async assertMayGet(
    context: RequestContext,
    ids: readonly string[]
  ): Promise<void> {}

  async assertMayCreate(context: RequestContext, data: Course): Promise<void> {}

  async assertMayUpdate(
    context: RequestContext,
    id: string,
    data: Partial<Course>
  ): Promise<void> {}

  async assertMayDelete(context: RequestContext, id: string): Promise<void> {}
}

import { RequestContext, SearchOptions } from '#/services/base';
import { Person } from '#/services/person';
import { BasePermissionHandler } from './base';

export class PersonPermissionHandler implements BasePermissionHandler<Person> {
  // TODO: Implement

  async assertMaySearch(
    context: RequestContext,
    options?: SearchOptions<Person> | undefined
  ): Promise<void> {}

  async assertMayGet(
    context: RequestContext,
    ids: readonly string[]
  ): Promise<void> {}

  async assertMayCreate(context: RequestContext, data: Person): Promise<void> {}

  async assertMayUpdate(
    context: RequestContext,
    id: string,
    data: Partial<Person>
  ): Promise<void> {}

  async assertMayDelete(context: RequestContext, id: string): Promise<void> {}
}

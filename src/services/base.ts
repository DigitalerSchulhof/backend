import { ListResult, SearchOptions, TypeFilter, WithId } from '#/models/base';

export type RequestContext = {};

export abstract class BaseService<Base extends object> {
  abstract search(
    context: RequestContext,
    options: SearchOptions<Base>
  ): Promise<ListResult<WithId<Base>>>;

  abstract get(
    context: RequestContext,
    ids: readonly string[]
  ): Promise<(WithId<Base> | null)[]>;

  abstract create(context: RequestContext, data: Base): Promise<WithId<Base>>;

  abstract update(
    context: RequestContext,
    id: string,
    data: Partial<Base>,
    options?: {
      ifRev?: string;
    }
  ): Promise<WithId<Base>>;

  abstract updateWhere(
    filter: TypeFilter<Base>,
    data: Partial<Base>
  ): Promise<number>;

  abstract delete(
    context: RequestContext,
    id: string,
    options?: {
      ifRev?: string;
    }
  ): Promise<WithId<Base>>;

  abstract deleteWhere(filter: TypeFilter<Base>): Promise<number>;
}

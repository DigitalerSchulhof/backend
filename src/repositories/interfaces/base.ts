import { ListResult, SearchOptions, TypeFilter, WithId } from '#/services/base';

export interface BaseRepository<Base extends object> {
  search(options: SearchOptions<Base>): Promise<ListResult<WithId<Base>>>;

  get(ids: readonly string[]): Promise<(WithId<Base> | null)[]>;

  create(data: Base): Promise<WithId<Base>>;

  update(
    id: string,
    data: Partial<Base>,
    options?: {
      ifRev?: string;
    }
  ): Promise<WithId<Base>>;

  updateWhere(filter: TypeFilter<Base>, data: Partial<Base>): Promise<number>;

  delete(
    id: string,
    options?: {
      ifRev?: string;
    }
  ): Promise<WithId<Base>>;

  deleteWhere(filter: TypeFilter<Base>): Promise<number>;
}

export type WithId<T> = T & {
  readonly id: string;
  readonly rev: string;
  readonly updatedAt: number;
  readonly createdAt: number;
};

export interface SearchOptions {
  limit?: number;
  offset?: number;
  filter?: object;
  order?: string;
}

export interface ListResult<T> {
  total: number;
  items: T[];
}

export interface BaseRepository<Base extends object> {
  search(options: SearchOptions): Promise<ListResult<WithId<Base>>>;

  get(id: string): Promise<WithId<Base> | null>;
  getByIds(ids: readonly string[]): Promise<(WithId<Base> | null)[]>;

  create(data: Base): Promise<WithId<Base>>;

  update(
    id: string,
    data: Partial<Base>,
    options?: {
      ifRev?: string;
    }
  ): Promise<WithId<Base>>;
  updateWhere(filter: object, data: Partial<Base>): Promise<WithId<Base>[]>;

  delete(
    id: string,
    options?: {
      ifRev?: string;
    }
  ): Promise<WithId<Base>>;
  deleteWhere(filter: object): Promise<WithId<Base>[]>;
}

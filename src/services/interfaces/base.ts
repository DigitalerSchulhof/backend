import { RequestContext } from '#/server';
import { MaybeArray } from '#/utils';

export type WithId<T> = T & {
  readonly id: string;
  readonly rev: string;
  readonly updatedAt: Date;
  readonly createdAt: Date;
};

export interface SearchOptions<Base extends object> {
  limit?: number;
  offset?: number;
  filter?: TypeFilter<Base>;
  order?: string;
}

export interface ListResult<T> {
  total: number;
  items: T[];
}

export type OverloadsForObject<
  Type extends object,
  Path extends string = '',
> = Type extends unknown
  ? {
      [Key in keyof Type & string]: Type[Key] extends
        | number
        | string
        | boolean
        | Buffer
        | Date
        | null
        ? OverloadsForScalar<`${Path}${Key}`, Type[Key]>
        : Type[Key] extends object
        ? OverloadsForObject<Type[Key], `${Path}${Key}.`>
        : never;
    }[keyof Type & string]
  : never;

type OverloadsForScalar<Key, Type> = [Type] extends [number]
  ? [Key, 'eq' | 'neq' | 'gt' | 'lt', Type] | [Key, 'in' | 'nin', Type[]]
  : [Type] extends [string]
  ? [Key, 'eq' | 'neq' | 'like' | 'nlike', Type] | [Key, 'in' | 'nin', Type[]]
  : [Type] extends [boolean | Buffer | Date]
  ? [Key, 'eq' | 'neq', Type]
  : [Type] extends [number | null]
  ? [Key, 'eq' | 'neq', Type] | [Key, 'in' | 'nin', Type[]]
  : [Type] extends [string | null]
  ? [Key, 'eq' | 'neq', Type] | [Key, 'in' | 'nin', Type[]]
  : [Type] extends [boolean | Buffer | Date | null]
  ? [Key, 'eq' | 'neq', Type]
  : never;

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
    context: RequestContext,
    filter: TypeFilter<Base>,
    data: Partial<Base>
  ): Promise<WithId<Base>[]>;

  abstract delete(
    context: RequestContext,

    id: string,
    options?: {
      ifRev?: string;
    }
  ): Promise<WithId<Base>>;

  abstract deleteWhere(
    context: RequestContext,
    filter: TypeFilter<Base>
  ): Promise<WithId<Base>[]>;
}

export class OrFilter<Type extends object> {
  filters;

  constructor(...filters: TypeFilter<Type>[]) {
    this.filters = filters;
  }
}

export class AndFilter<Type extends object> {
  filters;

  constructor(...filters: TypeFilter<Type>[]) {
    this.filters = filters;
  }
}

export class Filter<Type extends object = object> {
  property: string;
  operator: string;
  value: MaybeArray<number | string | boolean | Buffer | Date | null>;

  constructor(...args: OverloadsForObject<Type>) {
    // @ts-expect-error -- Not sure
    [this.property, this.operator, this.value] = args;
  }

  withTypes(): OverloadsForObject<Type> {
    return [
      this.property,
      this.operator,
      this.value,
    ] as OverloadsForObject<Type>;
  }
}

export type TypeFilter<Type extends object> =
  | OrFilter<Type>
  | AndFilter<Type>
  | Filter<Type>
  | null;

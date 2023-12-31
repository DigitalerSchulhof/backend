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

export type TypeFilter<Type extends object> =
  | OrFilter<Type>
  | AndFilter<Type>
  | Filter<Type>
  | null;

type OrFilter<Type extends object> = {
  or: TypeFilter<Type>[];
};

type AndFilter<Type extends object> = {
  and: TypeFilter<Type>[];
};

type Filter<Type extends object> = FilterWorker<Type>;

export type FilterWorker<
  Type extends object,
  Path extends string = '',
> = Type extends unknown
  ? {
      [Key in keyof Type & string]: Type[Key] extends
        | number
        | string
        | boolean
        | Date
        | Buffer
        | null
        ? FiltersForProperty<`${Path}${Key}`, Type[Key]>
        : Type[Key] extends object
        ? FilterWorker<Type[Key], `${Path}${Key}.`>
        : never;
    }[keyof Type & string]
  : never;

type FiltersForProperty<Key, Type> = [Type] extends [number | Date]
  ?
      | { property: Key; operator: 'eq' | 'neq' | 'gt' | 'lt'; value: Type }
      | { property: Key; operator: 'in' | 'nin'; value: Type[] }
  : [Type] extends [string]
  ?
      | {
          property: Key;
          operator: 'eq' | 'neq' | 'like' | 'nlike';
          value: Type;
        }
      | { property: Key; operator: 'in' | 'nin'; value: Type[] }
  : [Type] extends [boolean | Buffer]
  ? { property: Key; operator: 'eq' | 'neq'; value: Type }
  : [Type] extends [number | Date | null]
  ?
      | { property: Key; operator: 'eq' | 'neq'; value: Type }
      | { property: Key; operator: 'in' | 'nin'; value: Type[] }
  : [Type] extends [string | null]
  ?
      | { property: Key; operator: 'eq' | 'neq'; value: Type }
      | { property: Key; operator: 'in' | 'nin'; value: Type }
  : [Type] extends [boolean | Buffer | null]
  ? { property: Key; operator: 'eq' | 'neq'; value: Type }
  : never;

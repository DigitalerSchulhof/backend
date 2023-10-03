export type WithId<T> = T & {
  readonly id: string;
  readonly rev: string;
  readonly updatedAt: number;
  readonly createdAt: number;
};

export type { TypeFilter } from '#/models/base';

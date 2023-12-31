export type WithKey<T> = T & {
  _key: string;
  _rev: string;
  createdAt: number;
  updatedAt: number;
};

export type { TypeFilter } from '#/models/base';

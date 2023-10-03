import type * as jsBase from '#/models/base';
import * as js from '#/models/class';
import type * as dbBase from '../models/base';
import type * as db from '../models/class';
import { dateToArango, idFromArango } from './base';

export function classFromArango(
  clazz: dbBase.WithKey<db.Class>
): jsBase.WithId<js.Class> {
  return {
    ...idFromArango(clazz),
    name: clazz.name,
    levelId: clazz.levelId,
  };
}

export function classToArango(clazz: js.Class): db.Class;
export function classToArango(clazz: Partial<js.Class>): Partial<db.Class>;
export function classToArango(clazz: Partial<js.Class>): Partial<db.Class> {
  return {
    name: clazz.name,
    levelId: clazz.levelId,
  };
}

export function classFilterToArango(
  filter: jsBase.TypeFilter<jsBase.WithId<js.Class>>
): dbBase.TypeFilter<dbBase.WithKey<db.Class>> {
  if (filter === null) return null;

  if ('or' in filter) {
    return {
      or: filter.or.map((f) => classFilterToArango(f)),
    };
  }

  if ('and' in filter) {
    return {
      and: filter.and.map((f) => classFilterToArango(f)),
    };
  }

  const { property, operator, value } = filter;

  switch (property) {
    case 'id':
      switch (operator) {
        case 'eq':
        case 'neq':
        case 'like':
        case 'nlike':
          return {
            property: '_key',
            operator,
            value,
          };
        case 'in':
        case 'nin':
          return {
            property: '_key',
            operator,
            value,
          };
      }
    case 'rev':
      switch (operator) {
        case 'eq':
        case 'neq':
        case 'like':
        case 'nlike':
          return {
            property: '_rev',
            operator,
            value,
          };
        case 'in':
        case 'nin':
          return {
            property: '_rev',
            operator,
            value,
          };
      }
    case 'updatedAt':
    case 'createdAt':
      switch (operator) {
        case 'eq':
        case 'neq':
        case 'gt':
        case 'lt':
          return {
            property,
            operator,
            value: dateToArango(value),
          };
        case 'in':
        case 'nin':
          return {
            property,
            operator,
            value: value.map((v) => dateToArango(v)),
          };
      }
    case 'name':
    case 'levelId':
      return filter;
  }
}

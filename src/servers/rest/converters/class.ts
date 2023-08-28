import type * as jsBase from '#/services/base';
import * as js from '#/services/class';
import type * as restBase from '../controllers/base';
import type * as rest from '../controllers/class-controller';
import { dateFromRest, idToRest } from './base';

export function classToRest(
  clazz: jsBase.WithId<js.Class>
): restBase.WithId<rest.Class> {
  return {
    ...idToRest(clazz),
    name: clazz.name,
    levelId: clazz.levelId,
  };
}

export function classFromRest(clazz: rest.Class): js.Class;
export function classFromRest(clazz: Partial<rest.Class>): Partial<js.Class>;
export function classFromRest(clazz: Partial<rest.Class>): Partial<js.Class> {
  return {
    name: clazz.name,
    levelId: clazz.levelId,
  };
}

export function classFilterFromRest(
  filter: restBase.TypeFilter<restBase.WithId<rest.Class>>
): jsBase.TypeFilter<jsBase.WithId<js.Class>> {
  if (filter === null) return null;

  if ('or' in filter) {
    return {
      or: filter.or.map((f) => classFilterFromRest(f)),
    };
  }

  if ('and' in filter) {
    return {
      and: filter.and.map((f) => classFilterFromRest(f)),
    };
  }

  const { property, operator, value } = filter;

  switch (property) {
    case 'id':
    case 'rev':
      return filter;
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
            value: dateFromRest(value),
          };
        case 'in':
        case 'nin':
          return {
            property,
            operator,
            value: value.map((v) => dateFromRest(v)),
          };
      }
    case 'name':
    case 'levelId':
      return filter;
  }
}

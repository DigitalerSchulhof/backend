import type * as jsBase from '#/services/base';
import * as js from '#/services/level';
import type * as restBase from '../controllers/base';
import type * as rest from '../controllers/level-controller';
import { dateFromRest, idToRest } from './base';

export function levelToRest(
  level: jsBase.WithId<js.Level>
): restBase.WithId<rest.Level> {
  return {
    ...idToRest(level),
    name: level.name,
    schoolyearId: level.schoolyearId,
  };
}

export function levelFromRest(level: rest.Level): js.Level;
export function levelFromRest(level: Partial<rest.Level>): Partial<js.Level>;
export function levelFromRest(level: Partial<rest.Level>): Partial<js.Level> {
  return {
    name: level.name,
    schoolyearId: level.schoolyearId,
  };
}

export function levelFilterFromRest(
  filter: restBase.TypeFilter<restBase.WithId<rest.Level>>
): jsBase.TypeFilter<jsBase.WithId<js.Level>> {
  if (filter === null) return null;

  if ('or' in filter) {
    return {
      or: filter.or.map((f) => levelFilterFromRest(f)),
    };
  }

  if ('and' in filter) {
    return {
      and: filter.and.map((f) => levelFilterFromRest(f)),
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
    case 'schoolyearId':
      return filter;
  }
}

import type * as jsBase from '#/models/base';
import * as js from '#/models/level';
import type * as dbBase from '../models/base';
import type * as db from '../models/level';
import { dateToArango, idFromArango } from './base';

export function levelFromArango(
  level: dbBase.WithKey<db.Level>
): jsBase.WithId<js.Level> {
  return {
    ...idFromArango(level),
    name: level.name,
    schoolyearId: level.schoolyearId,
  };
}

export function levelToArango(level: js.Level): db.Level;
export function levelToArango(level: Partial<js.Level>): Partial<db.Level>;
export function levelToArango(level: Partial<js.Level>): Partial<db.Level> {
  return {
    name: level.name,
    schoolyearId: level.schoolyearId,
  };
}

export function levelFilterToArango(
  filter: jsBase.TypeFilter<jsBase.WithId<js.Level>>
): dbBase.TypeFilter<dbBase.WithKey<db.Level>> {
  if (filter === null) return null;

  if ('or' in filter) {
    return {
      or: filter.or.map((f) => levelFilterToArango(f)),
    };
  }

  if ('and' in filter) {
    return {
      and: filter.and.map((f) => levelFilterToArango(f)),
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
    case 'schoolyearId':
      return filter;
  }
}

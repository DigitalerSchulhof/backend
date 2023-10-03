import type * as jsBase from '#/models/base';
import * as js from '#/models/schoolyear';
import type * as dbBase from '../models/base';
import type * as db from '../models/schoolyear';
import { dateFromArango, dateToArango, idFromArango } from './base';

export function schoolyearFromArango(
  schoolyear: dbBase.WithKey<db.Schoolyear>
): jsBase.WithId<js.Schoolyear> {
  return {
    ...idFromArango(schoolyear),
    name: schoolyear.name,
    start: dateFromArango(schoolyear.start),
    end: dateFromArango(schoolyear.end),
  };
}

export function schoolyearToArango(schoolyear: js.Schoolyear): db.Schoolyear;
export function schoolyearToArango(
  schoolyear: Partial<js.Schoolyear>
): Partial<db.Schoolyear>;
export function schoolyearToArango(
  schoolyear: Partial<js.Schoolyear>
): Partial<db.Schoolyear> {
  return {
    name: schoolyear.name,
    start:
      schoolyear.start === undefined
        ? undefined
        : dateToArango(schoolyear.start),
    end:
      schoolyear.end === undefined ? undefined : dateToArango(schoolyear.end),
  };
}

export function schoolyearFilterToArango(
  filter: jsBase.TypeFilter<jsBase.WithId<js.Schoolyear>>
): dbBase.TypeFilter<dbBase.WithKey<db.Schoolyear>> {
  if (filter === null) return null;

  if ('or' in filter) {
    return {
      or: filter.or.map((f) => schoolyearFilterToArango(f)),
    };
  }

  if ('and' in filter) {
    return {
      and: filter.and.map((f) => schoolyearFilterToArango(f)),
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
      return filter;
    case 'start':
    case 'end':
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
  }
}

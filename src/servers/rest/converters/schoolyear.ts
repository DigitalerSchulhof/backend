import type * as jsBase from '#/services/base';
import * as js from '#/services/schoolyear';
import type * as restBase from '../controllers/base';
import type * as rest from '../controllers/schoolyear-controller';
import { dateFromRest, dateToRest, idToRest } from './base';

export function schoolyearToRest(
  schoolyear: jsBase.WithId<js.Schoolyear>
): restBase.WithId<rest.Schoolyear> {
  return {
    ...idToRest(schoolyear),
    name: schoolyear.name,
    start: dateToRest(schoolyear.start),
    end: dateToRest(schoolyear.end),
  };
}

export function schoolyearFromRest(schoolyear: rest.Schoolyear): js.Schoolyear;
export function schoolyearFromRest(
  schoolyear: Partial<rest.Schoolyear>
): Partial<js.Schoolyear>;
export function schoolyearFromRest(
  schoolyear: Partial<rest.Schoolyear>
): Partial<js.Schoolyear> {
  return {
    name: schoolyear.name,
    start:
      schoolyear.start === undefined
        ? undefined
        : dateFromRest(schoolyear.start),
    end:
      schoolyear.end === undefined ? undefined : dateFromRest(schoolyear.end),
  };
}

export function schoolyearFilterFromRest(
  filter: restBase.TypeFilter<restBase.WithId<rest.Schoolyear>>
): jsBase.TypeFilter<jsBase.WithId<js.Schoolyear>> {
  if (filter === null) return null;

  if ('or' in filter) {
    return {
      or: filter.or.map((f) => schoolyearFilterFromRest(f)),
    };
  }

  if ('and' in filter) {
    return {
      and: filter.and.map((f) => schoolyearFilterFromRest(f)),
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
  }
}

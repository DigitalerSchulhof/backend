import type * as dbBase from '#/repositories/arango/services/base';
import type * as db from '#/repositories/arango/services/course';
import type * as jsBase from '#/services/base';
import * as js from '#/services/course';
import { dateToArango, idFromArango } from './base';

export function courseFromArango(
  course: dbBase.WithKey<db.Course>
): jsBase.WithId<js.Course> {
  return {
    ...idFromArango(course),
    name: course.name,
    classId: course.classId,
  };
}

export function courseToArango(course: js.Course): db.Course;
export function courseToArango(course: Partial<js.Course>): Partial<db.Course>;
export function courseToArango(course: Partial<js.Course>): Partial<db.Course> {
  return {
    name: course.name,
    classId: course.classId,
  };
}

export function courseFilterToArango(
  filter: jsBase.TypeFilter<jsBase.WithId<js.Course>>
): dbBase.TypeFilter<dbBase.WithKey<db.Course>> {
  if (filter === null) return null;

  if ('or' in filter) {
    return {
      or: filter.or.map((f) => courseFilterToArango(f)),
    };
  }

  if ('and' in filter) {
    return {
      and: filter.and.map((f) => courseFilterToArango(f)),
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
    case 'classId':
      return filter;
  }
}

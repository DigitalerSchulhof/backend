import type * as jsBase from '#/models/base';
import * as js from '#/models/course';
import type * as restBase from '../models/base';
import type * as rest from '../models/course';
import { dateFromRest, idToRest } from './base';

export function courseToRest(
  course: jsBase.WithId<js.Course>
): restBase.WithId<rest.Course> {
  return {
    ...idToRest(course),
    name: course.name,
    classId: course.classId,
  };
}

export function courseFromRest(course: rest.Course): js.Course;
export function courseFromRest(
  course: Partial<rest.Course>
): Partial<js.Course>;
export function courseFromRest(
  course: Partial<rest.Course>
): Partial<js.Course> {
  return {
    name: course.name,
    classId: course.classId,
  };
}

export function courseFilterFromRest(
  filter: restBase.TypeFilter<restBase.WithId<rest.Course>>
): jsBase.TypeFilter<jsBase.WithId<js.Course>> {
  if (filter === null) return null;

  if ('or' in filter) {
    return {
      or: filter.or.map((f) => courseFilterFromRest(f)),
    };
  }

  if ('and' in filter) {
    return {
      and: filter.and.map((f) => courseFilterFromRest(f)),
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
    case 'classId':
      return filter;
  }
}

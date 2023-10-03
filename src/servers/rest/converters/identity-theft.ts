import type * as jsBase from '#/models/base';
import * as js from '#/models/identity-theft';
import type * as restBase from '../models/base';
import type * as rest from '../models/identity-theft';
import { dateFromRest, dateToRest, idToRest } from './base';

export function identityTheftToRest(
  identityTheft: jsBase.WithId<js.IdentityTheft>
): restBase.WithId<rest.IdentityTheft> {
  return {
    ...idToRest(identityTheft),
    personId: identityTheft.personId,
    reportedAt: dateToRest(identityTheft.reportedAt),
  };
}

export function identityTheftFromRest(
  identityTheft: rest.IdentityTheft
): js.IdentityTheft;
export function identityTheftFromRest(
  identityTheft: Partial<rest.IdentityTheft>
): Partial<js.IdentityTheft>;
export function identityTheftFromRest(
  identityTheft: Partial<rest.IdentityTheft>
): Partial<js.IdentityTheft> {
  return {
    personId: identityTheft.personId,
    reportedAt:
      identityTheft.reportedAt === undefined
        ? undefined
        : dateFromRest(identityTheft.reportedAt),
  };
}

export function identityTheftFilterFromRest(
  filter: restBase.TypeFilter<restBase.WithId<rest.IdentityTheft>>
): jsBase.TypeFilter<jsBase.WithId<js.IdentityTheft>> {
  if (filter === null) return null;

  if ('or' in filter) {
    return {
      or: filter.or.map((f) => identityTheftFilterFromRest(f)),
    };
  }

  if ('and' in filter) {
    return {
      and: filter.and.map((f) => identityTheftFilterFromRest(f)),
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
    case 'personId':
      return filter;
    case 'reportedAt':
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

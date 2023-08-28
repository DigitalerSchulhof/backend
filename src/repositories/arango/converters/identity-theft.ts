import type * as dbBase from '#/repositories/arango/services/base';
import type * as db from '#/repositories/arango/services/identity-theft';
import type * as jsBase from '#/services/base';
import * as js from '#/services/identity-theft';
import { dateFromArango, dateToArango, idFromArango } from './base';

export function identityTheftFromArango(
  identityTheft: dbBase.WithKey<db.IdentityTheft>
): jsBase.WithId<js.IdentityTheft> {
  return {
    ...idFromArango(identityTheft),
    personId: identityTheft.personId,
    reportedAt: dateFromArango(identityTheft.reportedAt),
  };
}

export function identityTheftToArango(
  identityTheft: js.IdentityTheft
): db.IdentityTheft;
export function identityTheftToArango(
  identityTheft: Partial<js.IdentityTheft>
): Partial<db.IdentityTheft>;
export function identityTheftToArango(
  identityTheft: Partial<js.IdentityTheft>
): Partial<db.IdentityTheft> {
  return {
    personId: identityTheft.personId,
    reportedAt:
      identityTheft.reportedAt === undefined
        ? undefined
        : dateToArango(identityTheft.reportedAt),
  };
}

export function identityTheftFilterToArango(
  filter: jsBase.TypeFilter<jsBase.WithId<js.IdentityTheft>>
): dbBase.TypeFilter<dbBase.WithKey<db.IdentityTheft>> {
  if (filter === null) return null;

  if ('or' in filter) {
    return {
      or: filter.or.map((f) => identityTheftFilterToArango(f)),
    };
  }

  if ('and' in filter) {
    return {
      and: filter.and.map((f) => identityTheftFilterToArango(f)),
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

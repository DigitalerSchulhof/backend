import type * as jsBase from '#/models/base';
import * as js from '#/models/session';
import type * as dbBase from '../models/base';
import type * as db from '../models/session';
import { dateFromArango, dateToArango, idFromArango } from './base';

export function sessionFromArango(
  session: dbBase.WithKey<db.Session>
): jsBase.WithId<js.Session> {
  return {
    ...idFromArango(session),
    accountId: session.accountId,
    issuedAt: dateFromArango(session.issuedAt),
    didShowLastLogin: session.didShowLastLogin,
  };
}

export function sessionToArango(session: js.Session): db.Session;
export function sessionToArango(
  session: Partial<js.Session>
): Partial<db.Session>;
export function sessionToArango(
  session: Partial<js.Session>
): Partial<db.Session> {
  return {
    accountId: session.accountId,
    issuedAt:
      session.issuedAt === undefined
        ? undefined
        : dateToArango(session.issuedAt),
    didShowLastLogin: session.didShowLastLogin,
  };
}

export function sessionFilterToArango(
  filter: jsBase.TypeFilter<jsBase.WithId<js.Session>>
): dbBase.TypeFilter<dbBase.WithKey<db.Session>> {
  if (filter === null) return null;

  if ('or' in filter) {
    return {
      or: filter.or.map((f) => sessionFilterToArango(f)),
    };
  }

  if ('and' in filter) {
    return {
      and: filter.and.map((f) => sessionFilterToArango(f)),
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
    case 'accountId':
      return filter;
    case 'issuedAt':
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
    case 'didShowLastLogin':
      return filter;
  }
}

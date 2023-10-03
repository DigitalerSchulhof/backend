import type * as jsBase from '#/models/base';
import * as js from '#/models/session';
import type * as restBase from '../models/base';
import type * as rest from '../models/session';
import { dateFromRest, dateToRest, idToRest } from './base';

export function sessionToRest(
  session: jsBase.WithId<js.Session>
): restBase.WithId<rest.Session> {
  return {
    ...idToRest(session),
    accountId: session.accountId,
    issuedAt: dateToRest(session.issuedAt),
    didShowLastLogin: session.didShowLastLogin,
  };
}

export function sessionFromRest(session: rest.Session): js.Session;
export function sessionFromRest(
  session: Partial<rest.Session>
): Partial<js.Session>;
export function sessionFromRest(
  session: Partial<rest.Session>
): Partial<js.Session> {
  return {
    accountId: session.accountId,
    issuedAt:
      session.issuedAt === undefined
        ? undefined
        : dateFromRest(session.issuedAt),
    didShowLastLogin: session.didShowLastLogin,
  };
}

export function sessionFilterFromRest(
  filter: restBase.TypeFilter<restBase.WithId<rest.Session>>
): jsBase.TypeFilter<jsBase.WithId<js.Session>> {
  if (filter === null) return null;

  if ('or' in filter) {
    return {
      or: filter.or.map((f) => sessionFilterFromRest(f)),
    };
  }

  if ('and' in filter) {
    return {
      and: filter.and.map((f) => sessionFilterFromRest(f)),
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
    case 'didShowLastLogin':
      return filter;
  }
}

import type * as jsBase from '#/models/base';
import * as js from '#/models/person';
import type * as dbBase from '../models/base';
import type * as db from '../models/person';
import { FilterError } from '#/utils/errors';
import { dateToArango, idFromArango } from './base';

export function personFromArango(
  person: dbBase.WithKey<db.Person>
): jsBase.WithId<js.Person> {
  return {
    ...idFromArango(person),
    firstname: person.firstname,
    lastname: person.lastname,
    type: personTypeFromArango(person.type),
    gender: personGenderFromArango(person.gender),
    teacherCode: person.teacherCode,
    accountId: person.accountId,
  };
}

function personTypeFromArango(personType: db.PersonType): js.PersonType {
  switch (personType) {
    case 'student':
      return js.PersonType.Student;
    case 'teacher':
      return js.PersonType.Teacher;
    case 'parent':
      return js.PersonType.Parent;
    case 'admin':
      return js.PersonType.Admin;
    case 'other':
      return js.PersonType.Other;
  }
}

function personGenderFromArango(
  personGender: db.PersonGender
): js.PersonGender {
  switch (personGender) {
    case 'male':
      return js.PersonGender.Male;
    case 'female':
      return js.PersonGender.Female;
    case 'other':
      return js.PersonGender.Other;
  }
}

export function personToArango(person: js.Person): db.Person;
export function personToArango(person: Partial<js.Person>): Partial<db.Person>;
export function personToArango(person: Partial<js.Person>): Partial<db.Person> {
  return {
    firstname: person.firstname,
    lastname: person.lastname,
    type:
      person.type === undefined ? undefined : personTypeToArango(person.type),
    gender:
      person.gender === undefined
        ? undefined
        : personGenderToArango(person.gender),
    teacherCode: person.teacherCode,
    accountId: person.accountId,
  };
}

function personTypeToArango(personType: js.PersonType): db.PersonType {
  switch (personType) {
    case js.PersonType.Student:
      return 'student';
    case js.PersonType.Teacher:
      return 'teacher';
    case js.PersonType.Parent:
      return 'parent';
    case js.PersonType.Admin:
      return 'admin';
    case js.PersonType.Other:
      return 'other';
  }
}

function personGenderToArango(personGender: js.PersonGender): db.PersonGender {
  switch (personGender) {
    case js.PersonGender.Male:
      return 'male';
    case js.PersonGender.Female:
      return 'female';
    case js.PersonGender.Other:
      return 'other';
  }
}

export function personFilterToArango(
  filter: jsBase.TypeFilter<jsBase.WithId<js.Person>>
): dbBase.TypeFilter<dbBase.WithKey<db.Person>> {
  if (filter === null) return null;

  if ('or' in filter) {
    return {
      or: filter.or.map((f) => personFilterToArango(f)),
    };
  }

  if ('and' in filter) {
    return {
      and: filter.and.map((f) => personFilterToArango(f)),
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
    case 'firstname':
    case 'lastname':
      return filter;
    case 'type':
      switch (operator) {
        case 'eq':
        case 'neq':
          return {
            property,
            operator,
            value: personTypeToArango(value),
          };
        case 'gt':
        case 'lt':
        case 'in':
        case 'nin':
          throw new FilterError(property, operator, 'PersonType');
      }
    case 'gender':
      switch (operator) {
        case 'eq':
        case 'neq':
          return {
            property,
            operator,
            value: personGenderToArango(value),
          };
        case 'gt':
        case 'lt':
        case 'in':
        case 'nin':
          throw new FilterError(property, operator, 'PersonGender');
      }
    case 'teacherCode':
    case 'accountId':
      return filter;
  }
}

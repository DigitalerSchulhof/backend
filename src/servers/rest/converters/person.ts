import type * as jsBase from '#/services/base';
import * as js from '#/services/person';
import { ClientFilterError } from '#/utils/errors';
import type * as restBase from '../controllers/base';
import type * as rest from '../controllers/person-controller';
import { dateFromRest, idToRest } from './base';

export function personToRest(
  person: jsBase.WithId<js.Person>
): restBase.WithId<rest.Person> {
  return {
    ...idToRest(person),
    firstname: person.firstname,
    lastname: person.lastname,
    type: personTypeToRest(person.type),
    gender: personGenderToRest(person.gender),
    teacherCode: person.teacherCode,
    accountId: person.accountId,
  };
}

function personTypeToRest(personType: js.PersonType): rest.PersonType {
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

function personGenderToRest(personGender: js.PersonGender): rest.PersonGender {
  switch (personGender) {
    case js.PersonGender.Male:
      return 'male';
    case js.PersonGender.Female:
      return 'female';
    case js.PersonGender.Other:
      return 'other';
  }
}

export function personFromRest(person: rest.Person): js.Person;
export function personFromRest(
  person: Partial<rest.Person>
): Partial<js.Person>;
export function personFromRest(
  person: Partial<rest.Person>
): Partial<js.Person> {
  return {
    firstname: person.firstname,
    lastname: person.lastname,
    type:
      person.type === undefined ? undefined : personTypeFromRest(person.type),
    gender:
      person.gender === undefined
        ? undefined
        : personGenderFromRest(person.gender),
    teacherCode: person.teacherCode,
    accountId: person.accountId,
  };
}

function personTypeFromRest(personType: rest.PersonType): js.PersonType {
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

function personGenderFromRest(
  personGender: rest.PersonGender
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

export function personFilterFromRest(
  filter: restBase.TypeFilter<restBase.WithId<rest.Person>>
): jsBase.TypeFilter<jsBase.WithId<js.Person>> {
  if (filter === null) return null;

  if ('or' in filter) {
    return {
      or: filter.or.map((f) => personFilterFromRest(f)),
    };
  }

  if ('and' in filter) {
    return {
      and: filter.and.map((f) => personFilterFromRest(f)),
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
            value: personTypeFromRest(value),
          };
        case 'like':
        case 'nlike':
        case 'in':
        case 'nin':
          throw new ClientFilterError(property, operator, 'PersonType');
      }
    case 'gender':
      switch (operator) {
        case 'eq':
        case 'neq':
          return {
            property,
            operator,
            value: personGenderFromRest(value),
          };
        case 'like':
        case 'nlike':
        case 'in':
        case 'nin':
          throw new ClientFilterError(property, operator, 'PersonGender');
      }
    case 'teacherCode':
    case 'accountId':
      return filter;
  }
}

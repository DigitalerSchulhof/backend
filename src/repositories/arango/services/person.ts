import { ArangoRepository } from './base';

export type Person = {
  firstname: string;
  lastname: string;
  type: PersonType;
  gender: PersonGender;
  teacherCode: string | null;
  accountId: string | null;
};

export type PersonType = 'student' | 'teacher' | 'parent' | 'admin' | 'other';

export type PersonGender = 'male' | 'female' | 'other';

export class ArangoPersonRepository extends ArangoRepository<Person> {
  protected override collectionName = 'persons';
}

import { Person } from '../models/person';
import { ArangoRepository } from './base';

export class ArangoPersonRepository extends ArangoRepository<Person> {
  protected override collectionName = 'persons';
}

import { Schoolyear } from '../models/schoolyear';
import { ArangoRepository } from './base';

export class ArangoSchoolyearRepository extends ArangoRepository<Schoolyear> {
  protected override collectionName = 'schoolyears';
}

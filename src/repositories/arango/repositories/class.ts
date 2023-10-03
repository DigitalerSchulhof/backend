import { Class } from '../models/class';
import { ArangoRepository } from './base';

export class ArangoClassRepository extends ArangoRepository<Class> {
  protected override collectionName = 'classes';
}

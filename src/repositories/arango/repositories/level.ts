import { Level } from '../models/level';
import { ArangoRepository } from './base';

export class ArangoLevelRepository extends ArangoRepository<Level> {
  protected override collectionName = 'levels';
}

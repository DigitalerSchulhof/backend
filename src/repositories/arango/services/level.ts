import { ArangoRepository } from './base';

export type Level = {
  name: string;
  schoolyearId: string;
};

export class ArangoLevelRepository extends ArangoRepository<Level> {
  protected override collectionName = 'levels';
}

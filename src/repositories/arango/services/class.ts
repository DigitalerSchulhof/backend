import { ArangoRepository } from './base';

export type Class = {
  name: string;
  levelId: string;
};

export class ArangoClassRepository extends ArangoRepository<Class> {
  protected override collectionName = 'classes';
}

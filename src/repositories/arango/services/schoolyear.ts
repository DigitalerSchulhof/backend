import { ArangoRepository } from './base';

export type Schoolyear = {
  name: string;
  start: number;
  end: number;
};

export class ArangoSchoolyearRepository extends ArangoRepository<Schoolyear> {
  protected override collectionName = 'schoolyears';
}

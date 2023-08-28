import { ArangoRepository } from './base';

export type Course = {
  name: string;
  classId: string;
};

export class ArangoCourseRepository extends ArangoRepository<Course> {
  protected override collectionName = 'courses';
}

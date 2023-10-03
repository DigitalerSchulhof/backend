import { Course } from '../models/course';
import { ArangoRepository } from './base';

export class ArangoCourseRepository extends ArangoRepository<Course> {
  protected override collectionName = 'courses';
}

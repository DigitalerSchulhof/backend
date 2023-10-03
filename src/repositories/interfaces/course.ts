import { Course } from '#/models/course';
import type { BaseRepository } from './base';

export interface CourseRepository extends BaseRepository<Course> {}

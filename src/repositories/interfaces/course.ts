import { Course } from '#/services/course';
import type { BaseRepository } from './base';

export interface CourseRepository extends BaseRepository<Course> {}

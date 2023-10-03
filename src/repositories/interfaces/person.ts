import { Person } from '#/models/person';
import type { BaseRepository } from './base';

export interface PersonRepository extends BaseRepository<Person> {}

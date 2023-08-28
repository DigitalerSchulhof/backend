import { Person } from '#/services/person';
import type { BaseRepository } from './base';

export interface PersonRepository extends BaseRepository<Person> {}

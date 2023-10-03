import { Session } from '../models/session';
import { ArangoRepository } from './base';

export class ArangoSessionRepository extends ArangoRepository<Session> {
  protected override collectionName = 'sessions';
}

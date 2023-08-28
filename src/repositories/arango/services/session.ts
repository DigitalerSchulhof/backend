import { ArangoRepository } from './base';

export type Session = {
  accountId: string;
  issuedAt: number;
  didShowLastLogin: boolean;
};

export class ArangoSessionRepository extends ArangoRepository<Session> {
  protected override collectionName = 'sessions';
}

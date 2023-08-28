import { ArangoRepository } from './base';

export type IdentityTheft = {
  personId: string;
  reportedAt: number;
};

export class ArangoIdentityTheftRepository extends ArangoRepository<IdentityTheft> {
  protected override collectionName = 'identity-thefts';
}

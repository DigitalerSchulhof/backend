import { IdentityTheft } from '../models/identity-theft';
import { ArangoRepository } from './base';

export class ArangoIdentityTheftRepository extends ArangoRepository<IdentityTheft> {
  protected override collectionName = 'identity-thefts';
}

import { Account } from '../models/account';
import { ArangoRepository } from './base';

export class ArangoAccountRepository extends ArangoRepository<Account> {
  protected override collectionName = 'accounts';
}

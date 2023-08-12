import { Account } from '#/services/account';
import { BasePermissionHandler } from './base';

export interface AccountPermissionHandler
  extends BasePermissionHandler<Account> {}

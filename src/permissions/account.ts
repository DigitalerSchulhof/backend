import { Account } from '#/interfaces/account';
import { BasePermissionHandler } from './base';

export interface AccountPermissionHandler
  extends BasePermissionHandler<Account> {}

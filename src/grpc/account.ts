import {
  BatchGetAccountsRequest,
  BatchGetAccountsResponse,
  CreateAccountRequest,
  CreateAccountResponse,
  DeleteAccountRequest,
  DeleteAccountResponse,
  DeleteAccountsWhereRequest,
  DeleteAccountsWhereResponse,
  GetAccountRequest,
  GetAccountResponse,
  ListAccountsRequest,
  ListAccountsResponse,
  UnimplementedAccountServiceService,
  UpdateAccountRequest,
  UpdateAccountResponse,
  UpdateAccountsWhereRequest,
  UpdateAccountsWhereResponse,
} from '@dsh/protocols/dsh/services/account/v1/service';
import { ServerUnaryCall, sendUnaryData } from '@grpc/grpc-js';

export class AccountGrpcService extends UnimplementedAccountServiceService {
  override ListAccounts(
    call: ServerUnaryCall<ListAccountsRequest, ListAccountsResponse>,
    callback: sendUnaryData<ListAccountsResponse>
  ): void {
    throw new Error('Method not implemented.');
  }
  override GetAccount(
    call: ServerUnaryCall<GetAccountRequest, GetAccountResponse>,
    callback: sendUnaryData<GetAccountResponse>
  ): void {
    throw new Error('Method not implemented.');
  }
  override BatchGetAccounts(
    call: ServerUnaryCall<BatchGetAccountsRequest, BatchGetAccountsResponse>,
    callback: sendUnaryData<BatchGetAccountsResponse>
  ): void {
    throw new Error('Method not implemented.');
  }
  override CreateAccount(
    call: ServerUnaryCall<CreateAccountRequest, CreateAccountResponse>,
    callback: sendUnaryData<CreateAccountResponse>
  ): void {
    throw new Error('Method not implemented.');
  }
  override UpdateAccount(
    call: ServerUnaryCall<UpdateAccountRequest, UpdateAccountResponse>,
    callback: sendUnaryData<UpdateAccountResponse>
  ): void {
    throw new Error('Method not implemented.');
  }
  override UpdateAccountsWhere(
    call: ServerUnaryCall<
      UpdateAccountsWhereRequest,
      UpdateAccountsWhereResponse
    >,
    callback: sendUnaryData<UpdateAccountsWhereResponse>
  ): void {
    throw new Error('Method not implemented.');
  }
  override DeleteAccount(
    call: ServerUnaryCall<DeleteAccountRequest, DeleteAccountResponse>,
    callback: sendUnaryData<DeleteAccountResponse>
  ): void {
    throw new Error('Method not implemented.');
  }
  override DeleteAccountsWhere(
    call: ServerUnaryCall<
      DeleteAccountsWhereRequest,
      DeleteAccountsWhereResponse
    >,
    callback: sendUnaryData<DeleteAccountsWhereResponse>
  ): void {
    throw new Error('Method not implemented.');
  }
}

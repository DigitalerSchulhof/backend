import { RequestContext } from '#/server';
import { Account, AccountService } from '#/services/interfaces/account';
import { AndFilter, OrFilter, TypeFilter } from '#/services/interfaces/base';
import { isNotNullOrUndefined } from '#/utils';
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
  ListAccountsResponseMeta,
  UnimplementedAccountServiceService,
  UpdateAccountRequest,
  UpdateAccountResponse,
  UpdateAccountsWhereRequest,
  UpdateAccountsWhereResponse,
} from '@dsh/protocols/dsh/services/account/v1/service';
import { ServerUnaryCall, sendUnaryData } from '@grpc/grpc-js';
import {
  accountFromGrpc,
  accountToGrpc,
} from '../converters/dsh/services/account/v1/resources';

interface GrpcContextManager {
  getContext(call: ServerUnaryCall<unknown, unknown>): RequestContext;
}

export class AccountGrpcService extends UnimplementedAccountServiceService {
  constructor(
    private readonly contextManager: GrpcContextManager,
    private readonly service: AccountService
  ) {
    super();
  }

  override async ListAccounts(
    call: ServerUnaryCall<ListAccountsRequest, ListAccountsResponse>,
    callback: sendUnaryData<ListAccountsResponse>
  ): Promise<void> {
    const { request } = call;
    const context = this.contextManager.getContext(call);

    const res = await this.service.search(context, {
      limit: request.limit,
      offset: request.offset,
      filter: filterFromGrpc(request.filter),
      order: request.order_by,
    });

    callback(
      null,
      new ListAccountsResponse({
        meta: new ListAccountsResponseMeta({
          total_count: res.total,
          limit: request.limit,
          offset: request.offset,
          has_previous: res.total > request.offset,
          has_next: res.total > request.offset + request.limit,
        }),
      })
    );
  }

  override async GetAccount(
    call: ServerUnaryCall<GetAccountRequest, GetAccountResponse>,
    callback: sendUnaryData<GetAccountResponse>
  ): Promise<void> {
    const { request } = call;
    const context = this.contextManager.getContext(call);

    const res = await this.service.get(context, request.id);

    callback(
      null,
      new GetAccountResponse({
        account: accountToGrpc(res),
      })
    );
  }
  override async BatchGetAccounts(
    call: ServerUnaryCall<BatchGetAccountsRequest, BatchGetAccountsResponse>,
    callback: sendUnaryData<BatchGetAccountsResponse>
  ): Promise<void> {
    const { request } = call;
    const context = this.contextManager.getContext(call);

    const res = await this.service.getByIds(context, request.ids);

    callback(
      null,
      new BatchGetAccountsResponse({
        accounts: res.map(accountToGrpc),
      })
    );
  }

  override async CreateAccount(
    call: ServerUnaryCall<CreateAccountRequest, CreateAccountResponse>,
    callback: sendUnaryData<CreateAccountResponse>
  ): Promise<void> {
    const { request } = call;
    const context = this.contextManager.getContext(call);

    const res = await this.service.create(
      context,
      accountFromGrpc(request.data),
      {
        ifPersonRev: request.has_if_person_rev
          ? request.if_person_rev
          : undefined,
      }
    );

    callback(
      null,
      new CreateAccountResponse({
        account: accountToGrpc(res),
      })
    );
  }

  override async UpdateAccount(
    call: ServerUnaryCall<UpdateAccountRequest, UpdateAccountResponse>,
    callback: sendUnaryData<UpdateAccountResponse>
  ): Promise<void> {
    const { request } = call;
    const context = this.contextManager.getContext(call);

    const res = await this.service.update(
      context,
      request.id,
      accountFromGrpc(
        Object.fromEntries(
          Object.entries(request.data).filter(([k]) =>
            request.update_mask.paths.includes(k)
          )
        )
      ),
      {
        ifRev: request.has_if_rev ? request.if_rev : undefined,
      }
    );

    callback(
      null,
      new UpdateAccountResponse({
        account: accountToGrpc(res),
      })
    );
  }

  override async UpdateAccountsWhere(
    call: ServerUnaryCall<
      UpdateAccountsWhereRequest,
      UpdateAccountsWhereResponse
    >,
    callback: sendUnaryData<UpdateAccountsWhereResponse>
  ): Promise<void> {
    const { request } = call;
    const context = this.contextManager.getContext(call);

    const res = await this.service.updateWhere(
      context,
      filterFromGrpc(request.filter),
      accountFromGrpc(
        Object.fromEntries(
          Object.entries(request.data).filter(([k]) =>
            request.update_mask.paths.includes(k)
          )
        )
      )
    );

    callback(
      null,
      new UpdateAccountsWhereResponse({
        accounts: res.map(accountToGrpc),
      })
    );
  }

  override async DeleteAccount(
    call: ServerUnaryCall<DeleteAccountRequest, DeleteAccountResponse>,
    callback: sendUnaryData<DeleteAccountResponse>
  ): Promise<void> {
    const { request } = call;
    const context = this.contextManager.getContext(call);

    const res = await this.service.delete(context, request.id);

    callback(
      null,
      new DeleteAccountResponse({
        account: accountToGrpc(res),
      })
    );
  }

  override async DeleteAccountsWhere(
    call: ServerUnaryCall<
      DeleteAccountsWhereRequest,
      DeleteAccountsWhereResponse
    >,
    callback: sendUnaryData<DeleteAccountsWhereResponse>
  ): Promise<void> {
    const { request } = call;
    const context = this.contextManager.getContext(call);

    const res = await this.service.deleteWhere(
      context,
      filterFromGrpc(request.filter)
    );

    callback(
      null,
      new DeleteAccountsWhereResponse({
        accounts: res.map(accountToGrpc),
      })
    );
  }
}

function filterFromGrpc(filter: string): TypeFilter<Account>;
function filterFromGrpc(
  filter: string | undefined
): TypeFilter<Account> | undefined;
function filterFromGrpc(
  filter: string | undefined
): TypeFilter<Account> | undefined {
  if (filter === undefined) return undefined;

  return filterFromGrpcWorker(JSON.parse(filter));
}

function filterFromGrpcWorker(
  filter: unknown | undefined
): TypeFilter<Account> | undefined {
  if (filter === undefined) return undefined;

  if (typeof filter !== 'object' || filter === null) {
    throw new Error('Invalid filter');
  }

  if ('and' in filter && Array.isArray(filter.and)) {
    return new AndFilter(
      ...filter.and.map(filterFromGrpcWorker).filter(isNotNullOrUndefined)
    );
  }

  if ('or' in filter && Array.isArray(filter.or)) {
    return new OrFilter(
      ...filter.or.map(filterFromGrpcWorker).filter(isNotNullOrUndefined)
    );
  }

  if (
    !('property' in filter) ||
    !('operator' in filter) ||
    !('value' in filter)
  ) {
    throw new Error('Invalid filter');
  }

  const { property, operator, value } = filter;

  switch (property) {
    case 'id':
      return { property: 'id', operator, value };
    case 'rev':
      return { property: 'rev', operator, value };
    case 'updatedAt':
      return {
        property: 'updated_at',
        operator,
        value: (value as Date).getTime(),
      };
    case 'createdAt':
      return {
        property: 'created_at',
        operator,
        value: (value as Date).getTime(),
      };
    case 'personId':
      return { property: 'person_id', operator, value };
    case 'username':
      return { property: 'username', operator, value };
    case 'email':
      return { property: 'email', operator, value };
    case 'password':
      return {
        property: 'password',
        operator,
        value: (value as Buffer).toString('base64'),
      };
    case 'salt':
      return {
        property: 'salt',
        operator,
        value: (value as Buffer).toString('base64'),
      };
    case 'passwordExpiresAt':
      return {
        property: 'password_expires_at',
        operator,
        value: (value as Date).getTime(),
      };
    case 'lastLogin':
      return {
        property: 'last_login',
        operator,
        value: (value as Date).getTime(),
      };
    case 'secondLastLogin':
      return {
        property: 'second_last_login',
        operator,
        value: (value as Date).getTime(),
      };
    case 'settings.emailOn.newMessage':
      return { property: 'settings.email_on.new_message', operator, value };
    case 'settings.emailOn.newSubstitution':
      return {
        property: 'settings.email_on.new_substitution',
        operator,
        value,
      };
    case 'settings.emailOn.newNews':
      return { property: 'settings.email_on.new_news', operator, value };
    case 'settings.pushOn.newMessage':
      return { property: 'settings.push_on.new_message', operator, value };
    case 'settings.pushOn.newSubstitution':
      return { property: 'settings.push_on.new_substitution', operator, value };
    case 'settings.pushOn.newNews':
      return { property: 'settings.push_on.new_news', operator, value };
    case 'settings.considerNews.newEvent':
      return { property: 'settings.consider_news.new_event', operator, value };
    case 'settings.considerNews.newBlog':
      return { property: 'settings.consider_news.new_blog', operator, value };
    case 'settings.considerNews.newGallery':
      return {
        property: 'settings.consider_news.new_gallery',
        operator,
        value,
      };
    case 'settings.considerNews.fileChanged':
      return {
        property: 'settings.consider_news.file_changed',
        operator,
        value,
      };
    case 'settings.mailbox.deleteAfter':
      return { property: 'settings.mailbox.delete_after', operator, value };
    case 'settings.mailbox.deleteAfterInBin':
      return {
        property: 'settings.mailbox.delete_after_in_bin',
        operator,
        value,
      };
    case 'settings.profile.sessionTimeout':
      return { property: 'settings.profile.session_timeout', operator, value };
    case 'settings.profile.formOfAddress':
      return {
        property: 'settings.profile.form_of_address',
        operator,
        value,
      };
    default:
      throw new Error('Invariant: Unknown property in filter');
  }
}

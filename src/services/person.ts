import { PersonPermissionHandler } from '#/permissions/person';
import { permissionHandlerTokens } from '#/permissions/tokens';
import { PersonRepository } from '#/repositories/interfaces/person';
import { repositoryTokens } from '#/repositories/tokens';
import { PersonValidator } from '#/validators/person';
import { validatorTokens } from '#/validators/tokens';
import { tokens } from 'typed-inject';
import {
  BaseService,
  ListResult,
  RequestContext,
  SearchOptions,
  TypeFilter,
  WithId,
} from './base';

export type Person = {
  firstname: string;
  lastname: string;
  type: PersonType;
  gender: PersonGender;
  teacherCode: string | null;
  accountId: string | null;
};

export enum PersonType {
  Student,
  Teacher,
  Parent,
  Admin,
  Other,
}

export enum PersonGender {
  Male,
  Female,
  Other,
}

export class PersonService extends BaseService<Person> {
  constructor(
    private readonly repository: PersonRepository,
    private readonly validator: PersonValidator,
    private readonly permissionHandler: PersonPermissionHandler
  ) {
    super();
  }

  static readonly inject = tokens(
    repositoryTokens.personRepository,
    validatorTokens.personValidator,
    permissionHandlerTokens.personPermissionHandler
  );

  override async search(
    context: RequestContext,
    options: SearchOptions<WithId<Person>>
  ): Promise<ListResult<WithId<Person>>> {
    await this.permissionHandler.assertMaySearch(context);

    return this.repository.search(options);
  }

  override async get(
    context: RequestContext,
    ids: readonly string[]
  ): Promise<(WithId<Person> | null)[]> {
    await this.permissionHandler.assertMayGet(context, ids);

    return this.repository.get(ids);
  }

  override async create(
    context: RequestContext,
    data: Person
  ): Promise<WithId<Person>> {
    await this.permissionHandler.assertMayCreate(context, data);
    await this.validator.assertCanCreate(data);

    return this.repository.create(data);
  }

  override async update(
    context: RequestContext,
    id: string,
    data: Partial<Person>,
    options?: { ifRev?: string }
  ): Promise<WithId<Person>> {
    await this.permissionHandler.assertMayUpdate(context, id, data);
    await this.validator.assertCanUpdate(id, data);

    return this.repository.update(id, data, options);
  }

  override updateWhere(
    filter: TypeFilter<Person>,
    data: Partial<Person>
  ): Promise<number> {
    return this.repository.updateWhere(filter, data);
  }

  override async delete(
    context: RequestContext,
    id: string,
    options?: { ifRev?: string }
  ): Promise<WithId<Person>> {
    await this.permissionHandler.assertMayDelete(context, id);

    return this.repository.delete(id, options);
  }

  override async deleteWhere(filter: TypeFilter<Person>): Promise<number> {
    return this.repository.deleteWhere(filter);
  }
}

import { IdentityTheftRepository } from '#/repositories/interfaces/identity-theft';
import { PersonRepository } from '#/repositories/interfaces/person';
import { repositoryTokens } from '#/repositories/tokens';
import { IdentityTheft } from '#/services/identity-theft';
import { IdNotFoundError, InputValidationError } from '#/utils/errors';
import { tokens } from 'typed-inject';
import { BaseValidator, aggregateValidationErrors } from './base';

export const PERSON_DOES_NOT_EXIST = 'PERSON_DOES_NOT_EXIST';

export class IdentityTheftValidator extends BaseValidator<IdentityTheft> {
  constructor(
    private readonly repository: IdentityTheftRepository,
    private readonly personRepository: PersonRepository
  ) {
    super();
  }

  static readonly inject = tokens(
    repositoryTokens.identityTheftRepository,
    repositoryTokens.personRepository
  );

  override async assertCanCreate(data: IdentityTheft): Promise<void> {
    await aggregateValidationErrors([this.assertPersonExists(data.personId)]);
  }

  override async assertCanUpdate(
    id: string,
    data: Partial<IdentityTheft>
  ): Promise<void> {
    const [base] = await this.repository.get([id]);

    if (!base) {
      throw new IdNotFoundError();
    }

    await aggregateValidationErrors([
      data.personId === undefined
        ? null
        : this.assertPersonExists(data.personId),
    ]);
  }

  private async assertPersonExists(personId: string): Promise<void> {
    const [person] = await this.personRepository.get([personId]);

    if (!person) {
      throw new InputValidationError(PERSON_DOES_NOT_EXIST);
    }
  }
}

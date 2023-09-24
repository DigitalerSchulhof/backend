import { PersonRepository } from '#/repositories/interfaces/person';
import { repositoryTokens } from '#/repositories/tokens';
import { Person } from '#/services/person';
import { IdNotFoundError } from '#/utils/errors';
import { tokens } from 'typed-inject';
import { BaseValidator } from './base';

export class PersonValidator extends BaseValidator<Person> {
  constructor(private readonly repository: PersonRepository) {
    super();
  }

  static readonly inject = tokens(repositoryTokens.personRepository);

  override async assertCanCreate(): Promise<void> {}

  override async assertCanUpdate(id: string): Promise<void> {
    const [base] = await this.repository.get([id]);

    if (!base) {
      throw new IdNotFoundError();
    }
  }
}

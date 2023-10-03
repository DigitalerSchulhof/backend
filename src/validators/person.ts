import { Person } from '#/models/person';
import { PersonRepository } from '#/repositories/interfaces/person';
import { IdNotFoundError } from '#/utils/errors';
import { BaseValidator } from './utils';

export class PersonValidator extends BaseValidator<Person> {
  constructor(private readonly repository: PersonRepository) {
    super();
  }

  override async assertCanCreate(): Promise<void> {}

  override async assertCanUpdate(id: string): Promise<void> {
    const [base] = await this.repository.get([id]);

    if (!base) {
      throw new IdNotFoundError();
    }
  }
}

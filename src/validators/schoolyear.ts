import { SchoolyearRepository } from '#/repositories/interfaces/schoolyear';
import { repositoryTokens } from '#/repositories/tokens';
import { Schoolyear } from '#/services/schoolyear';
import { IdNotFoundError } from '#/utils/errors';
import { tokens } from 'typed-inject';
import { BaseValidator } from './base';

export class SchoolyearValidator extends BaseValidator<Schoolyear> {
  constructor(private readonly repository: SchoolyearRepository) {
    super();
  }

  static readonly inject = tokens(repositoryTokens.schoolyearRepository);

  override async assertCanCreate(): Promise<void> {}

  override async assertCanUpdate(id: string): Promise<void> {
    const [base] = await this.repository.get([id]);

    if (!base) {
      throw new IdNotFoundError();
    }
  }
}

import { Schoolyear } from '#/models/schoolyear';
import { SchoolyearRepository } from '#/repositories/interfaces/schoolyear';
import { IdNotFoundError } from '#/utils/errors';
import { BaseValidator } from './utils';

export class SchoolyearValidator extends BaseValidator<Schoolyear> {
  constructor(private readonly repository: SchoolyearRepository) {
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

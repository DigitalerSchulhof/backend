import { Level } from '#/models/level';
import { LevelRepository } from '#/repositories/interfaces/level';
import { SchoolyearRepository } from '#/repositories/interfaces/schoolyear';
import { IdNotFoundError, InputValidationError } from '#/utils/errors';
import { BaseValidator, aggregateValidationErrors } from './utils';

export const SCHOOLYEAR_DOES_NOT_EXIST = 'SCHOOLYEAR_DOES_NOT_EXIST';

export class LevelValidator extends BaseValidator<Level> {
  constructor(
    private readonly repository: LevelRepository,
    private readonly schoolyearRepository: SchoolyearRepository
  ) {
    super();
  }

  override async assertCanCreate(data: Level): Promise<void> {
    await aggregateValidationErrors([
      this.assertSchoolyearExists(data.schoolyearId),
    ]);
  }

  override async assertCanUpdate(
    id: string,
    data: Partial<Level>
  ): Promise<void> {
    const [base] = await this.repository.get([id]);

    if (!base) {
      throw new IdNotFoundError();
    }

    await aggregateValidationErrors([
      data.schoolyearId === undefined
        ? null
        : this.assertSchoolyearExists(data.schoolyearId),
    ]);
  }

  private async assertSchoolyearExists(schoolyearId: string): Promise<void> {
    const [schoolyear] = await this.schoolyearRepository.get([schoolyearId]);

    if (!schoolyear) {
      throw new InputValidationError(SCHOOLYEAR_DOES_NOT_EXIST);
    }
  }
}

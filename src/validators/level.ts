import { LevelRepository } from '#/repositories/interfaces/level';
import { SchoolyearRepository } from '#/repositories/interfaces/schoolyear';
import { repositoryTokens } from '#/repositories/tokens';
import { Level } from '#/services/level';
import { IdNotFoundError, InputValidationError } from '#/utils/errors';
import { tokens } from 'typed-inject';
import { BaseValidator, aggregateValidationErrors } from './base';

export const SCHOOLYEAR_DOES_NOT_EXIST = 'SCHOOLYEAR_DOES_NOT_EXIST';

export class LevelValidator extends BaseValidator<Level> {
  constructor(
    private readonly repository: LevelRepository,
    private readonly schoolyearRepository: SchoolyearRepository
  ) {
    super();
  }

  static readonly inject = tokens(
    repositoryTokens.levelRepository,
    repositoryTokens.schoolyearRepository
  );

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

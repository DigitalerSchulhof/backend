import { ClassRepository } from '#/repositories/interfaces/class';
import { LevelRepository } from '#/repositories/interfaces/level';
import { repositoryTokens } from '#/repositories/tokens';
import { Class } from '#/services/class';
import { IdNotFoundError, InputValidationError } from '#/utils/errors';
import { tokens } from 'typed-inject';
import { BaseValidator, aggregateValidationErrors } from './base';

export const LEVEL_DOES_NOT_EXIST = 'LEVEL_DOES_NOT_EXIST';

export class ClassValidator extends BaseValidator<Class> {
  constructor(
    private readonly repository: ClassRepository,
    private readonly levelRepository: LevelRepository
  ) {
    super();
  }

  static readonly inject = tokens(
    repositoryTokens.classRepository,
    repositoryTokens.levelRepository
  );

  override async assertCanCreate(data: Class): Promise<void> {
    await aggregateValidationErrors([this.assertLevelExists(data.levelId)]);
  }

  override async assertCanUpdate(
    id: string,
    data: Partial<Class>
  ): Promise<void> {
    const [base] = await this.repository.get([id]);

    if (!base) {
      throw new IdNotFoundError();
    }

    await aggregateValidationErrors([
      data.levelId === undefined ? null : this.assertLevelExists(data.levelId),
    ]);
  }

  private async assertLevelExists(levelId: string): Promise<void> {
    const [level] = await this.levelRepository.get([levelId]);

    if (!level) {
      throw new InputValidationError(LEVEL_DOES_NOT_EXIST);
    }
  }
}

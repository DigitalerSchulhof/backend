import { Class } from '#/models/class';
import { ClassRepository } from '#/repositories/interfaces/class';
import { LevelRepository } from '#/repositories/interfaces/level';
import { IdNotFoundError, InputValidationError } from '#/utils/errors';
import { BaseValidator, aggregateValidationErrors } from './utils';

export const LEVEL_DOES_NOT_EXIST = 'LEVEL_DOES_NOT_EXIST';

export class ClassValidator extends BaseValidator<Class> {
  constructor(
    private readonly repository: ClassRepository,
    private readonly levelRepository: LevelRepository
  ) {
    super();
  }

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

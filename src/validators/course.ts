import { CourseRepository } from '#/repositories/interfaces/course';
import { ClassRepository } from '#/repositories/interfaces/class';
import { repositoryTokens } from '#/repositories/tokens';
import { Course } from '#/services/course';
import { IdNotFoundError, InputValidationError } from '#/utils/errors';
import { tokens } from 'typed-inject';
import { BaseValidator, aggregateValidationErrors } from './base';

export const CLASS_DOES_NOT_EXIST = 'CLASS_DOES_NOT_EXIST';

export class CourseValidator extends BaseValidator<Course> {
  constructor(
    private readonly repository: CourseRepository,
    private readonly classRepository: ClassRepository
  ) {
    super();
  }

  static readonly inject = tokens(
    repositoryTokens.courseRepository,
    repositoryTokens.classRepository
  );

  override async assertCanCreate(data: Course): Promise<void> {
    await aggregateValidationErrors([this.assertClassExists(data.classId)]);
  }

  override async assertCanUpdate(
    id: string,
    data: Partial<Course>
  ): Promise<void> {
    const [base] = await this.repository.get([id]);

    if (!base) {
      throw new IdNotFoundError();
    }

    await aggregateValidationErrors([
      data.classId === undefined ? null : this.assertClassExists(data.classId),
    ]);
  }

  private async assertClassExists(classId: string): Promise<void> {
    const [clazz] = await this.classRepository.get([classId]);

    if (!clazz) {
      throw new InputValidationError(CLASS_DOES_NOT_EXIST);
    }
  }
}

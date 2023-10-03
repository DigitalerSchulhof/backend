import { Course } from '#/models/course';
import { ClassRepository } from '#/repositories/interfaces/class';
import { CourseRepository } from '#/repositories/interfaces/course';
import { IdNotFoundError, InputValidationError } from '#/utils/errors';
import { BaseValidator, aggregateValidationErrors } from './utils';

export const CLASS_DOES_NOT_EXIST = 'CLASS_DOES_NOT_EXIST';

export class CourseValidator extends BaseValidator<Course> {
  constructor(
    private readonly repository: CourseRepository,
    private readonly classRepository: ClassRepository
  ) {
    super();
  }

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

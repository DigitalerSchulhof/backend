import { Session } from '#/models/session';
import { AccountRepository } from '#/repositories/interfaces/account';
import { SessionRepository } from '#/repositories/interfaces/session';
import { IdNotFoundError, InputValidationError } from '#/utils/errors';
import { BaseValidator, aggregateValidationErrors } from './utils';

export const Account_DOES_NOT_EXIST = 'Account_DOES_NOT_EXIST';

export class SessionValidator extends BaseValidator<Session> {
  constructor(
    private readonly repository: SessionRepository,
    private readonly accountRepository: AccountRepository
  ) {
    super();
  }

  override async assertCanCreate(data: Session): Promise<void> {
    await aggregateValidationErrors([this.assertAccountExists(data.accountId)]);
  }

  override async assertCanUpdate(
    id: string,
    data: Partial<Session>
  ): Promise<void> {
    const [base] = await this.repository.get([id]);

    if (!base) {
      throw new IdNotFoundError();
    }

    await aggregateValidationErrors([
      data.accountId === undefined
        ? null
        : this.assertAccountExists(data.accountId),
    ]);
  }

  private async assertAccountExists(AccountId: string): Promise<void> {
    const [Account] = await this.accountRepository.get([AccountId]);

    if (!Account) {
      throw new InputValidationError(Account_DOES_NOT_EXIST);
    }
  }
}

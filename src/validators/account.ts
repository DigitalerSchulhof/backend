import { Account, AccountSettings } from '#/models/account';
import { AccountRepository } from '#/repositories/interfaces/account';
import { PersonRepository } from '#/repositories/interfaces/person';
import { IdNotFoundError, InputValidationError } from '#/utils/errors';
import { BaseValidator, aggregateValidationErrors } from './utils';

export const MAX_SESSION_TIMEOUT = 300;

export const PERSON_DOES_NOT_EXIST = 'PERSON_DOES_NOT_EXIST';

export const ACCOUNT_SETTINGS_MAILBOX_DELETE_AFTER_INVALID =
  'ACCOUNT_SETTINGS_MAILBOX_DELETE_AFTER_INVALID';
export const ACCOUNT_SETTINGS_MAILBOX_DELETE_AFTER_IN_BIN_INVALID =
  'ACCOUNT_SETTINGS_MAILBOX_DELETE_AFTER_IN_BIN_INVALID';
export const ACCOUNT_SETTINGS_PROFILE_SESSION_TIMEOUT_INVALID =
  'ACCOUNT_SETTINGS_PROFILE_SESSION_TIMEOUT_INVALID';

export class AccountValidator extends BaseValidator<Account> {
  constructor(
    private readonly repository: AccountRepository,
    private readonly personRepository: PersonRepository
  ) {
    super();
  }

  override async assertCanCreate(data: Account): Promise<void> {
    await aggregateValidationErrors([
      this.assertPersonExists(data.personId),
      this.assertSettingsValid(data.settings),
    ]);
  }

  override async assertCanUpdate(
    id: string,
    data: Partial<Account>
  ): Promise<void> {
    const [base] = await this.repository.get([id]);

    if (!base) {
      throw new IdNotFoundError();
    }

    await aggregateValidationErrors([
      data.personId === undefined
        ? null
        : this.assertPersonExists(data.personId),
      data.settings === undefined
        ? null
        : this.assertSettingsValid(data.settings),
    ]);
  }

  private async assertPersonExists(personId: string): Promise<void> {
    const [person] = await this.personRepository.get([personId]);

    if (!person) {
      throw new InputValidationError(PERSON_DOES_NOT_EXIST);
    }
  }

  private async assertSettingsValid(settings: AccountSettings): Promise<void> {
    await aggregateValidationErrors([
      settings.mailbox.deleteAfter !== null &&
      (!Number.isInteger(settings.mailbox.deleteAfter) ||
        settings.mailbox.deleteAfter <= 0)
        ? this.throwValidationError(
            ACCOUNT_SETTINGS_MAILBOX_DELETE_AFTER_INVALID
          )
        : null,
      settings.mailbox.deleteAfterInBin !== null &&
      (!Number.isInteger(settings.mailbox.deleteAfterInBin) ||
        settings.mailbox.deleteAfterInBin <= 0)
        ? this.throwValidationError(
            ACCOUNT_SETTINGS_MAILBOX_DELETE_AFTER_IN_BIN_INVALID
          )
        : null,
      !Number.isInteger(settings.profile.sessionTimeout) ||
      settings.profile.sessionTimeout <= 0 ||
      settings.profile.sessionTimeout > MAX_SESSION_TIMEOUT
        ? this.throwValidationError(
            ACCOUNT_SETTINGS_PROFILE_SESSION_TIMEOUT_INVALID
          )
        : null,
    ]);
  }
}

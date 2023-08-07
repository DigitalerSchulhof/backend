import { Account, AccountSettings } from '#/services/interfaces/account';
import { IdNotFoundError, InputValidationError } from '#/utils/errors';
import { BaseValidator, aggregateValidationErrors } from './base';

export const MAX_SESSION_TIMEOUT = 300;

export const PERSON_DOES_NOT_EXIST = 'PERSON_DOES_NOT_EXIST';

export const ACCOUNT_SETTINGS_MAILBOX_DELETE_AFTER_INVALID =
  'ACCOUNT_SETTINGS_MAILBOX_DELETE_AFTER_INVALID';
export const ACCOUNT_SETTINGS_MAILBOX_DELETE_AFTER_IN_BIN_INVALID =
  'ACCOUNT_SETTINGS_MAILBOX_DELETE_AFTER_IN_BIN_INVALID';
export const ACCOUNT_SETTINGS_PROFILE_SESSION_TIMEOUT_INVALID =
  'ACCOUNT_SETTINGS_PROFILE_SESSION_TIMEOUT_INVALID';

export class AccountValidator extends BaseValidator<Account> {
  override async assertCanCreate(data: Account): Promise<void | never> {
    await this.assertPersonExists(data.personId);

    await aggregateValidationErrors([this.assertSettingsValid(data.settings)]);
  }

  override async assertCanUpdate(
    id: string,
    data: Partial<Account>
  ): Promise<void | never> {
    const [base] = await this.repositories.account.getByIds([id]);

    if (!base) {
      throw new IdNotFoundError();
    }

    await aggregateValidationErrors([
      data.settings === undefined
        ? null
        : this.assertSettingsValid(data.settings),
    ]);
  }

  override async assertCanUpdateMany(data: Partial<Account>): Promise<void> {
    await aggregateValidationErrors([
      data.settings === undefined
        ? null
        : this.assertSettingsValid(data.settings),
    ]);
  }

  private async assertPersonExists(personId: string): Promise<void | never> {
    const [person] = await this.repositories.person.getByIds([personId]);

    if (!person) {
      throw new InputValidationError(PERSON_DOES_NOT_EXIST);
    }
  }

  private async assertSettingsValid(
    settings: AccountSettings
  ): Promise<void | never> {
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

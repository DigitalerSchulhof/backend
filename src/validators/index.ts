import { RepositoryInjector } from '#/repositories';
import { Injector, createInjector } from 'typed-inject';
import { AccountValidator } from './account';
import { ClassValidator } from './class';
import { CourseValidator } from './course';
import { IdentityTheftValidator } from './identity-theft';
import { LevelValidator } from './level';
import { PersonValidator } from './person';
import { SchoolyearValidator } from './schoolyear';
import { SessionValidator } from './session';
import { validatorTokens } from './tokens';

export function createValidatorInjector(
  repositoryInjector: RepositoryInjector
): ValidatorInjector {
  const validatorInjector = repositoryInjector
    .provideClass(validatorTokens.accountValidator, AccountValidator)
    .provideClass(validatorTokens.classValidator, ClassValidator)
    .provideClass(validatorTokens.courseValidator, CourseValidator)
    .provideClass(
      validatorTokens.identityTheftValidator,
      IdentityTheftValidator
    )
    .provideClass(validatorTokens.levelValidator, LevelValidator)
    .provideClass(validatorTokens.personValidator, PersonValidator)
    .provideClass(validatorTokens.schoolyearValidator, SchoolyearValidator)
    .provideClass(validatorTokens.sessionValidator, SessionValidator);

  return createInjector()
    .provideValue(
      validatorTokens.accountValidator,
      validatorInjector.resolve(validatorTokens.accountValidator)
    )
    .provideValue(
      validatorTokens.classValidator,
      validatorInjector.resolve(validatorTokens.classValidator)
    )
    .provideValue(
      validatorTokens.courseValidator,
      validatorInjector.resolve(validatorTokens.courseValidator)
    )
    .provideValue(
      validatorTokens.identityTheftValidator,
      validatorInjector.resolve(validatorTokens.identityTheftValidator)
    )
    .provideValue(
      validatorTokens.levelValidator,
      validatorInjector.resolve(validatorTokens.levelValidator)
    )
    .provideValue(
      validatorTokens.personValidator,
      validatorInjector.resolve(validatorTokens.personValidator)
    )
    .provideValue(
      validatorTokens.schoolyearValidator,
      validatorInjector.resolve(validatorTokens.schoolyearValidator)
    )
    .provideValue(
      validatorTokens.sessionValidator,
      validatorInjector.resolve(validatorTokens.sessionValidator)
    );
}

export type ValidatorInjector = Injector<{
  [validatorTokens.accountValidator]: AccountValidator;
  [validatorTokens.classValidator]: ClassValidator;
  [validatorTokens.courseValidator]: CourseValidator;
  [validatorTokens.identityTheftValidator]: IdentityTheftValidator;
  [validatorTokens.levelValidator]: LevelValidator;
  [validatorTokens.personValidator]: PersonValidator;
  [validatorTokens.schoolyearValidator]: SchoolyearValidator;
  [validatorTokens.sessionValidator]: SessionValidator;
}>;

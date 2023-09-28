import { ServiceInjector } from '#/services';
import { Injector, createInjector } from 'typed-inject';
import { RestAccountController } from './account-controller';
import { RestContextManager } from './base';
import { RestClassController } from './class-controller';
import { RestCourseController } from './course-controller';
import { RestIdentityTheftController } from './identity-theft-controller';
import { RestLevelController } from './level-controller';
import { RestPersonController } from './person-controller';
import { RestSchoolyearController } from './schoolyear-controller';
import { RestSessionController } from './session-controller';
import { restControllerTokens } from './tokens';

export function createRestControllerInjector(
  serviceInjector: ServiceInjector
): RestControllerInjector {
  const controllerInjector = serviceInjector
    .provideClass('contextManager', RestContextManager)
    .provideClass(restControllerTokens.accountController, RestAccountController)
    .provideClass(restControllerTokens.classController, RestClassController)
    .provideClass(restControllerTokens.courseController, RestCourseController)
    .provideClass(
      restControllerTokens.identityTheftController,
      RestIdentityTheftController
    )
    .provideClass(restControllerTokens.levelController, RestLevelController)
    .provideClass(restControllerTokens.personController, RestPersonController)
    .provideClass(
      restControllerTokens.schoolyearController,
      RestSchoolyearController
    )
    .provideClass(
      restControllerTokens.sessionController,
      RestSessionController
    );

  const realControllerInjector = createInjector()
    .provideValue(
      restControllerTokens.accountController,
      controllerInjector.resolve(restControllerTokens.accountController)
    )
    .provideValue(
      restControllerTokens.classController,
      controllerInjector.resolve(restControllerTokens.classController)
    )
    .provideValue(
      restControllerTokens.courseController,
      controllerInjector.resolve(restControllerTokens.courseController)
    )
    .provideValue(
      restControllerTokens.identityTheftController,
      controllerInjector.resolve(restControllerTokens.identityTheftController)
    )
    .provideValue(
      restControllerTokens.levelController,
      controllerInjector.resolve(restControllerTokens.levelController)
    )
    .provideValue(
      restControllerTokens.personController,
      controllerInjector.resolve(restControllerTokens.personController)
    )
    .provideValue(
      restControllerTokens.schoolyearController,
      controllerInjector.resolve(restControllerTokens.schoolyearController)
    )
    .provideValue(
      restControllerTokens.sessionController,
      controllerInjector.resolve(restControllerTokens.sessionController)
    );

  return realControllerInjector;
}

export type RestControllerInjector = Injector<{
  [restControllerTokens.accountController]: RestAccountController;
  [restControllerTokens.classController]: RestClassController;
  [restControllerTokens.courseController]: RestCourseController;
  [restControllerTokens.identityTheftController]: RestIdentityTheftController;
  [restControllerTokens.levelController]: RestLevelController;
  [restControllerTokens.personController]: RestPersonController;
  [restControllerTokens.schoolyearController]: RestSchoolyearController;
  [restControllerTokens.sessionController]: RestSessionController;
}>;

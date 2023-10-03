import { RestContextManager } from '#/servers/rest/controllers/base';
import { Services } from '#/services';
import { RestAccountController } from './account-controller';
import { RestClassController } from './class-controller';
import { RestCourseController } from './course-controller';
import { RestIdentityTheftController } from './identity-theft-controller';
import { RestLevelController } from './level-controller';
import { RestPersonController } from './person-controller';
import { RestSchoolyearController } from './schoolyear-controller';
import { RestSessionController } from './session-controller';

export function createRestControllers(services: Services): RestControllers {
  const contextManager = new RestContextManager();

  return {
    accountController: new RestAccountController(
      contextManager,
      services.accountService
    ),
    classController: new RestClassController(
      contextManager,
      services.classService
    ),
    courseController: new RestCourseController(
      contextManager,
      services.courseService
    ),
    identityTheftController: new RestIdentityTheftController(
      contextManager,
      services.identityTheftService
    ),
    levelController: new RestLevelController(
      contextManager,
      services.levelService
    ),
    personController: new RestPersonController(
      contextManager,
      services.personService
    ),
    schoolyearController: new RestSchoolyearController(
      contextManager,
      services.schoolyearService
    ),
    sessionController: new RestSessionController(
      contextManager,
      services.sessionService
    ),
  };
}

export type RestControllers = {
  accountController: RestAccountController;
  classController: RestClassController;
  courseController: RestCourseController;
  identityTheftController: RestIdentityTheftController;
  levelController: RestLevelController;
  personController: RestPersonController;
  schoolyearController: RestSchoolyearController;
  sessionController: RestSessionController;
};

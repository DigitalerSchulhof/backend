import { RequestContext } from '#/services/base';

export class RestContextManager {
  async get(req: Request): Promise<RequestContext> {
    return {};
  }
}

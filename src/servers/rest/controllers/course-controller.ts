import { CourseService } from '#/services/course';
import { serviceTokens } from '#/services/tokens';
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Path,
  Post,
  Query,
  Request,
  Route,
  Tags,
} from 'tsoa';
import { tokens } from 'typed-inject';
import {
  courseFilterFromRest,
  courseFromRest,
  courseToRest,
} from '../converters/course';
import {
  ListResult,
  Req,
  RestContextManager,
  SearchOptions,
  WithId,
} from './base';
import { restControllerTokens } from './tokens';

export type Course = {
  name: string;
  classId: string;
};

@Route('courses')
@Tags('Course')
export class RestCourseController extends Controller {
  constructor(
    private readonly contextManager: RestContextManager,
    private readonly service: CourseService
  ) {
    super();
  }

  static readonly inject = tokens(
    'contextManager',
    serviceTokens.courseService
  );

  static readonly key = restControllerTokens.courseController;

  @Post('search')
  async search(
    @Request() req: Req,
    @Body() searchOptions: SearchOptions<WithId<Course>>
  ): Promise<ListResult<Course>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.search(context, {
      limit: searchOptions.limit,
      offset: searchOptions.offset,
      filter:
        searchOptions.filter === undefined
          ? undefined
          : courseFilterFromRest(searchOptions.filter),
      order: searchOptions.order,
    });

    return {
      items: res.items.map((r) => courseToRest(r)),
      total: res.total,
    };
  }

  @Get(':ids')
  async get(
    @Request() req: Req,
    @Path() ids: string
  ): Promise<(WithId<Course> | null)[]> {
    const context = await this.contextManager.get(req);

    const res = await this.service.get(context, ids.split(','));

    return res.map((r) => (r === null ? null : courseToRest(r)));
  }

  @Post('')
  async create(
    @Request() req: Req,
    @Body() data: Course
  ): Promise<WithId<Course>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.create(context, courseFromRest(data));

    return courseToRest(res);
  }

  @Patch(':id')
  async update(
    @Request() req: Req,
    @Path() id: string,
    @Body() data: Partial<Course>,
    @Query() ifRev?: string
  ): Promise<WithId<Course>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.update(context, id, courseFromRest(data), {
      ifRev,
    });

    return courseToRest(res);
  }

  @Delete(':id')
  async delete(
    @Request() req: Req,
    @Path() id: string,
    @Query() ifRev?: string
  ): Promise<WithId<Course>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.delete(context, id, { ifRev });

    return courseToRest(res);
  }
}

import { ListResult, SearchOptions } from '#/models/base';
import { CourseService } from '#/services/course';
import {
  Body,
  Delete,
  Get,
  Patch,
  Path,
  Post,
  Query,
  Req,
  Route,
  Tags,
} from 'bttp';
import {
  courseFilterFromRest,
  courseFromRest,
  courseToRest,
} from '../converters/course';
import { WithId } from '../models/base';
import { Course } from '../models/course';
import { RestContextManager } from './base';

@Route('courses')
@Tags('Course')
export class RestCourseController {
  constructor(
    private readonly contextManager: RestContextManager,
    private readonly service: CourseService
  ) {}

  @Post('search')
  async search(
    @Req() req: Request,
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

  @Get(':id')
  async get(
    @Req() req: Request,
    @Path() id: string
  ): Promise<(WithId<Course> | null)[]> {
    const context = await this.contextManager.get(req);

    const res = await this.service.get(context, id.split(','));

    return res.map((r) => (r === null ? null : courseToRest(r)));
  }

  @Post('')
  async create(
    @Req() req: Request,
    @Body() data: Course
  ): Promise<WithId<Course>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.create(context, courseFromRest(data));

    return courseToRest(res);
  }

  @Patch(':id')
  async update(
    @Req() req: Request,
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
    @Req() req: Request,
    @Path() id: string,
    @Query() ifRev?: string
  ): Promise<WithId<Course>> {
    const context = await this.contextManager.get(req);

    const res = await this.service.delete(context, id, { ifRev });

    return courseToRest(res);
  }
}

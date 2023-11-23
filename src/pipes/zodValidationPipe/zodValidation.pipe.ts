import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { ZodIssue, ZodObject } from 'zod';
import { ZodFailHandlerRes } from './interfaces/zodValidationPipe.interface';

export class ZodValidationPipe implements PipeTransform {
  constructor(
    private schema: ZodObject<any>,
    private status: number,
  ) {}

  private getFails(issues: ZodIssue[]) {
    const fails: ZodFailHandlerRes = {};
    for (const issue of issues) {
      for (const path of issue.path) {
        let readablePath = path;
        if (typeof path === 'string') readablePath = path.split('_').toString();
        if (fails[path]) fails[path].push(`The ${readablePath} ${issue.message}`);
        else fails[path] = [issue.message];
      }
    }
    return fails;
  }

  async transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const res = await this.schema.safeParseAsync(value);
      if (!res.success) {
        throw new HttpException(
          {
            success: false,
            message: 'Validation failed',
            fails: this.getFails(res.error.issues),
          },
          this.status,
        );
      }
      return res.data;
    } catch (error) {
      if (Object.hasOwn((error as any).response, 'success')) throw error;
      throw new BadRequestException('Validation failed');
    }
  }
}

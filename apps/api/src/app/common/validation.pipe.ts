import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { createFlightSchema } from '@az-testing-workshop/shared/util/api-models';
import { ZodSchema } from 'zod';

@Injectable()
export class ValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {
  }
  transform(value: unknown): boolean {
    try {
      return this.schema.parse(value);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}

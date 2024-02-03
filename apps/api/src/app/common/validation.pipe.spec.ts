import { ValidationPipe } from './validation.pipe';
import { z } from 'zod';

describe('ZodValidationPipe', () => {
  it('should be defined', () => {
    expect(new ValidationPipe(z.object({}))).toBeDefined();
  });
});

import { z } from 'zod';

const PositionSchema = z.object({
  name: z
    .string({
      required_error: 'The name field is required',
      invalid_type_error: 'The name field must be a string',
    })
    .min(2, { message: 'The name must be at least 2 characters' }),
});

/** Create Position Schema */
export const CreatePositionSchema = PositionSchema.required();
export type CreatePositionDTO = z.infer<typeof CreatePositionSchema>;

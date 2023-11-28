import { z } from 'zod';

const UserSchema = z.object({
  name: z
    .string({
      required_error: 'The name field is required.',
      invalid_type_error: 'The name must be a string type',
    })
    .min(2, { message: 'The name must be at least 2 characters.' })
    .max(60, { message: 'The name may not be greater than 60 characters.' }),
  email: z
    .string({
      required_error: 'The email field is required.',
      invalid_type_error: 'The email must be a string.',
    })
    .email({ message: 'The email must be a valid email address.' })
    .min(2, { message: 'The email must be at least 2 characters.' })
    .max(100, { message: 'The email may not be greater than 100 characters.' })
    .regex(
      /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/,
      {
        message:
          'The email must be a valid email address with @ symbol and correct domain. For example: hello@example.com',
      },
    ),
  phone: z
    .string({
      required_error: 'The phone field is required.',
      invalid_type_error: 'The phone must be a string',
    })
    .regex(/^[+]?380(\d{9})$/, {
      message: 'The phone must be a valid Ukraine phone number. For example: +380123456789.',
    }),
  position_id: z
    .string({
      required_error: 'The position id field is required.',
      invalid_type_error: 'The position id must be a number',
    })
    .regex(/^\d+$/, { message: 'The position id must be an integer at least 1' }),
  // TODO: remove or use photo: z.null()
  photo: z.any(),
});

const PhotoSchema = z
  .object({
    photo: z.string(),
  })
  .required();
const DBUserSchema = UserSchema.merge(PhotoSchema).merge(
  z
    .object({ id: z.string(), position_id: z.number(), registration_timestamp: z.number() })
    .required(),
);

/** Create User Schema */
export const CreateUserSchema = UserSchema.required();
export type CreateUserDTO = z.infer<typeof CreateUserSchema>;
export type DBCreateUserDTO = z.infer<typeof DBUserSchema>;

/** Get User Param*/
export type GetUserDTO = { id: string };

/** Update User Schema */
export const UpdateUserSchema = UserSchema.partial();
export type UpdateUserDTO = z.infer<typeof UpdateUserSchema>;

/** Get User's avatar Schema Param*/
export type GetUsersAvatarDTO = { filename: string };

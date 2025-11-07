import * as z from 'zod';

const usernameRegex = /^[a-z][a-z0-9_]*$/;

const strongPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/`]).{8,72}$/;

const RESERVED_USERNAMES = new Set(['admin', 'root', 'support', 'api']);

export const registerUserSchema = z
  .object({
    email: z.email(`Invalid email format is given!!!`).trim().toLowerCase().min(3),

    username: z
      .string()
      .trim()
      .lower()
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username must be at most 30 characters')
      .regex(usernameRegex, 'Only lowercase letters, digits, underscores; must start with a letter')
      .optional(),
    // You store passwordHash in DB; we validate plaintext here.

    password: z
      .string()
      .min(10, 'Password must be at least 8 characters')
      .max(72, 'Password must be at most 72 characters')
      .regex(strongPassword, 'Password must include lowercase, uppercase, digit, and symbol'),

    passwordConfirm: z.string().min(1, 'Please confirm your password'),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirm) {
      ctx.addIssue({
        code: `custom`,
        path: ['passwordConfirm'],
        message: `Passwords are not equal`,
        input: data.passwordConfirm,
      });
    }

    if (data.username && RESERVED_USERNAMES.has(data.username)) {
      ctx.addIssue({
        code: `custom`,
        path: [`username`],
        message: `This username is reserved`,
      });
    }
  });

const validData = registerUserSchema.parse({
  email: `onat@gmail.com`,
  password: `123456789`,
  passwordConfirm: `1234567890`,
});

console.log(validData);

import * as z from 'zod';

const registerSchema = z.object({
  name: z.string(),
});

// We can use like this

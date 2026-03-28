import { z } from 'zod';

export const activitySchema = z.object({
  id: z.number().optional(),
  label: z
    .string()
    .min(3, { message: "L'étiquette de l'activité est trop courte" })
    .max(50, { message: "L'étiquette de l'activité est trop longue" })
});

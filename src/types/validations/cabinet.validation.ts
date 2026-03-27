import { z } from 'zod';

export const cabinetSchema = z.object({
  enterpriseName: z.string().min(1, 'Nom du Cabinet est obligatoire'),
  email: z
    .string()
    .email('E-mail invalide')
    .min(1, 'E-mail est obligatoire')
    .or(z.literal('')),
  taxIdNumber: z.string().min(1, "Numéro d'identification fiscale est obligatoire"),
  phone: z.string().optional(),
  activityId: z.number().int().positive('L\'activité est obligatoire').optional(),
  currencyId: z.number().int().positive('La devise est obligatoire').optional(),
});

export type CabinetSchema = z.infer<typeof cabinetSchema>;

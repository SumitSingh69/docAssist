import { z } from "zod";

export const userRegisterValidation = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(100, "Name must be at most 100 characters long"),
  email: z.string().email("Invalid email"),
  phone: z
    .string()
    .min(10, "Phone must be at least 10 characters long")
    .max(10, "Phone must be at most 10 characters long"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(100, "Password must be at most 100 characters long"),
  role: z.enum(["USER", "ADMIN"]).optional(),
});

export const userLoginValidation = z.object({
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .max(100, "Password must be at most 100 characters long"),
});

// Sub-schemas for medical data
const medicalConditionSchema = z.object({
  name: z.string().min(1, "Condition name is required"),
  diagnosedAt: z.string().datetime().optional(),
});

const medicationSchema = z.object({
  name: z.string().min(1, "Medication name is required"),
  dosage: z.string().optional(),
  frequency: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

const allergySchema = z.object({
  name: z.string().min(1, "Allergy name is required"),
  severity: z.string().optional(),
});

const injurySchema = z.object({
  name: z.string().optional(),
  year: z.number().optional(),
  notes: z.string().optional(),
});

const lifestyleSchema = z.object({
  alcohol: z.boolean().optional(),
  smoking: z.boolean().optional(),
  caffeine: z.boolean().optional(),
  fasting: z.boolean().optional(),
});

export const updateUserValidation = z.object({
  // Basic Info
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(100, "Name must be at most 100 characters long")
    .optional(),
  email: z.string().email("Invalid email").optional(),
  phone: z
    .string()
    .min(10, "Phone must be at least 10 characters long")
    .max(10, "Phone must be at most 10 characters long")
    .optional(),
  image: z.string().url("Invalid image URL").optional(),
  age: z.number().min(1).max(150).optional(),
  gender: z.enum(["male", "female", "other"]).optional(),

  // Medical Profile
  medicalConditions: z.array(medicalConditionSchema).optional(),
  allergies: z.array(allergySchema).optional(),
  pastInjuries: z.array(injurySchema).optional(),

  // Medication History
  currentMedications: z.array(medicationSchema).optional(),
  pastMedications: z.array(medicationSchema).optional(),

  // Lifestyle
  lifestyle: lifestyleSchema.optional(),
});

export type UserRegisterType = z.infer<typeof userRegisterValidation>;
export type UserLoginType = z.infer<typeof userLoginValidation>;
export type UpdateUserType = z.infer<typeof updateUserValidation>;

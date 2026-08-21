import z from "zod"

export const signInFormSchema = z.object({
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required.")
    .regex(
      /^(\+?\d[\d\s-]{7,}\d)$/,
      "Please enter a valid phone number."
    )
    .max(20, "Phone number must be at most 20 characters."),
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(50, "Name must be at most 50 characters."),
})

export type SignInFormValues = z.infer<typeof signInFormSchema>

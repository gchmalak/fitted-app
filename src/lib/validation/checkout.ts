import { z } from "zod";


export const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(8, "Valid phone number is required"),
  street: z.string().min(3, "Street address is required"),
  city: z.string().min(2, "City is required"),
  wilaya: z.string().min(2, "Wilaya/state is required"),
  postalCode: z.string().optional(),
  deliveryNotes: z.string().optional(),
});
export type CheckoutInput = z.infer<typeof checkoutSchema>;
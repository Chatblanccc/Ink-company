import { z } from "zod";

export const inquiryFormSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.email("Please enter a valid email address."),
  productType: z.string().min(1, "Please select a product type."),
  volume: z.string().min(1, "Please select an expected volume."),
  message: z.string().min(10, "Please tell us a bit more about your project."),
});

export const signInSchema = z.object({
  account: z.string().min(1),
  password: z.string().min(8),
});

export type InquiryFormValues = z.infer<typeof inquiryFormSchema>;

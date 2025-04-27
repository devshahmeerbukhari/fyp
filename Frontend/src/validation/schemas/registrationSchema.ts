// import { z } from "zod";

// export const RegistrationSchema = z.object({
//   username: z
//     .string()
//     .min(3, { message: "Username must be at least 3 characters long" })
//     .max(20, { message: "Username must not exceed 20 characters" }),
//   email: z
//     .string()
//     .email({ message: "Invalid email address" }),
//   password: z
//     .string()
//     .min(6, { message: "Password must be at least 6 characters long" })
//     .max(50, { message: "Password must not exceed 50 characters" }),
// });

// export type RegistrationSchemaType = z.infer<typeof RegistrationSchema>;

import { z } from 'zod'

export const RegistrationSchema = z.object({
    username: z.string().min(6, {message: "Username must be of at least 6 character(s)"}),
    email: z.string().email({message: "Invalid Email"}),
    password: z.string().min(6, {message: "Password must be of atleast of 6 charcter(s)"}),
})
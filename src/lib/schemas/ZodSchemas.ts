import { z } from "zod";

export const RegistrationRequestSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
});

export const LoginRequestSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const SetActiveOrganizationSchema = z.object({
  activeOrganizationUuid: z
    .string()
    .uuid({ message: "Invalid organization UUID." }),
});

export const RefreshRequestSchema = z.object({});

export const ScheduleReportsRequestSchema = z.object({
  frequency: z.enum(["weekly", "biweekly", "monthly", "custom", "cron"], {
    errorMap: () => ({ message: "Invalid frequency type" }),
  }),
  clientUuid: z.string().uuid({ message: "Invalid client UUID" }),
  time: z.string().optional(),
  dayOfWeek: z
    .enum([
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ])
    .optional(),
  dayOfMonth: z.number().min(1).max(31).optional(),

  intervalDays: z.number().optional(),

  cronExpression: z.string().optional(),

  startDate: z.string().optional(),
  conditions: z.string().optional(),
});

export const ReportsQueryParamsSchema = z.object({
  datePreset: z.string().min(1, { message: "datePreset is required" }),
  organizationName: z
    .string()
    .min(1, { message: "organizationName is required" }),
});

export const UrlParamsSchema = z.object({
  uuid: z.string().min(1, { message: "UUID is required" }),
});

export const AdAccountsBusinessesRequestSchema = z.object({
  organizationName: z
    .string()
    .min(1, { message: "organizationName is required" }),
});

export const UpdateNameRequestSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
});

export const SaveAnswerRequestSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

export const CreateOrganizationRequestSchema = z.object({
  name: z.string()
});

export const UseInviteCodeRequestSchema = z.object({
  code: z.string()
});

export const HandleFacebookLoginRequestSchema = z.object({
  code: z.string(),
  redirectUri: z.string()
});

export const CreateClientRequestSchema = z.object({
  name: z.string(),
  facebookAdAccounts: z.array(z.string()),
  // tiktokAdAccounts: z.array(z.string())
});

export const CreateClientFacebookAdAccountRequestSchema = z.object({
  adAccountId: z.string()
});

export const DeleteClientFacebookAdAccountRequestSchema = z.object({
});


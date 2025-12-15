import { ObjectId } from "mongodb";
import { z } from "zod";

export const objectIdString = z
  .string()
  .regex(/^[a-fA-F0-9]{24}$/, "Invalid ObjectId")
  .brand<"ObjectIdString">();

export const objectId = z.union([
  objectIdString,
  z.instanceof(ObjectId, {
    message: "Invalid ObjectId instance",
  }),
]);

export const userRole = z.enum(["ADMIN", "QA_MANAGER", "USER", "GUEST_USER"]);
  // ADMIN // Full system access
  // QA_MANAGER // Can schedule auditors, manage audits
  // USER // Regular user (auditor, auditee, sme depending on assignment)
  // GUEST_USER // External/temporary access

export const documentType = z.enum([
  "REQUEST_LETTER",
  "REPORT_LETTER",
  "CLOSURE_LETTER",
  "GENERIC_UPLOAD",
]);
export const findingStatus = z.enum([
  "COMPLIANT",
  "PARTLY_COMPLIANT",
  "NON_COMPLIANT",
  "NOT_APPLICABLE",
  "NOTABLY_COMPLIANT",
]);
export const notificationType = z.enum([
  "CORRECTIVE_ACTION_REMINDER",
  "CLOSURE",
  "GENERAL",
]);
export const notificationStatus = z.enum(["UNREAD", "READ", "EMAILED"]);
export const emailStatus = z.enum(["QUEUED", "SENT", "FAILED", "DELIVERED"]);

export const companySchema = z.object({
  _id: objectId.optional(),
  name: z.string(),
  address: z.string().optional(),
  standards: z.any().optional(),
  timeZone: z.string().optional(),
  location: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const userSchema = z.object({
  _id: objectId.optional(),
  supabaseUserId: z.string(),
  title: z.string().optional(),
  firstName: z.string(),
  middleNames: z.string().optional(),
  surname: z.string(),
  name: z.string(),
  email: z.string().email(),
  phoneNumber: z.string().optional(),
  role: userRole,
  companyId: objectId.optional(),
  timeZone: z.string().optional(),
  location: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const auditSchema = z.object({
  _id: objectId.optional(),
  title: z.string(),
  companyId: objectId,
  auditeeId: objectId,
  expectedStart: z.date().optional(),
  expectedEnd: z.date().optional(),
  proposedStart: z.date().optional(),
  proposedEnd: z.date().optional(),
  actualStart: z.date().optional(),
  actualEnd: z.date().optional(),
  requestLetterId: objectId.optional(),
  requestLetterSentAt: z.date().optional(),
  requestLetterSentById: objectId.optional(),
  requestLetterAcceptedAt: z.date().optional(),
  requestLetterAcceptedById: objectId.optional(),
  reportLetterId: objectId.optional(),
  reportLetterSentAt: z.date().optional(),
  reportLetterSentById: objectId.optional(),
  reportLetterApprovedAt: z.date().optional(),
  reportLetterApprovedById: objectId.optional(),
  closureLetterId: objectId.optional(),
  closureLetterSentAt: z.date().optional(),
  closureLetterSentById: objectId.optional(),
  closureDatetime: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const auditAuditorSchema = z.object({
  _id: objectId.optional(),
  auditId: objectId,
  auditorId: objectId,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const auditSMESchema = z.object({
  _id: objectId.optional(),
  auditId: objectId,
  smeId: objectId.optional(),
  email: z.string().email(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const auditRequirementSchema = z.object({
  _id: objectId.optional(),
  auditId: objectId,
  standard: z.string(),
  mandatory: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const scheduleSchema = z.object({
  _id: objectId.optional(),
  auditId: objectId,
  auditorId: objectId,
  expectedStart: z.date().optional(),
  expectedEnd: z.date().optional(),
  actualStart: z.date().optional(),
  actualEnd: z.date().optional(),
  deleted: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const auditorExpertiseSchema = z.object({
  _id: objectId.optional(),
  auditorId: objectId,
  standard: z.string(),
  certificate: z.string().optional(),
  verified: z.boolean().default(false),
  renewalDate: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const availabilitySchema = z.object({
  _id: objectId.optional(),
  userId: objectId,
  dayOfWeek: z.number().int(),
  startTime: z.string(),
  endTime: z.string(),
  available: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const auditTemplateSchema = z.object({
  _id: objectId.optional(),
  name: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const questionSchema = z.object({
  _id: objectId.optional(),
  templateId: objectId,
  text: z.string(),
  options: z.any().optional(),
  order: z.number().int().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const findingSchema = z.object({
  _id: objectId.optional(),
  auditId: objectId,
  questionId: objectId,
  status: findingStatus,
  accepted: z.boolean().default(false),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const correctiveActionSchema = z.object({
  _id: objectId.optional(),
  auditId: objectId,
  findingId: objectId,
  description: z.string(),
  deadline: z.date(),
  accepted: z.boolean().default(false),
  completedAt: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const observationSchema = z.object({
  _id: objectId.optional(),
  auditId: objectId,
  authorId: objectId,
  text: z.string(),
  evidence: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const documentSchema = z.object({
  _id: objectId.optional(),
  name: z.string(),
  type: documentType,
  filepath: z.string(),
  uploadedBy: objectId,
  uploadedAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const notificationSchema = z.object({
  _id: objectId.optional(),
  auditId: objectId,
  type: notificationType,
  message: z.string(),
  recipients: z.any(),
  status: notificationStatus,
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const emailOutboxSchema = z.object({
  _id: objectId.optional(),
  to: z.string(),
  subject: z.string(),
  body: z.string(),
  type: z.string(),
  status: emailStatus.default("QUEUED"),
  retries: z.number().int().nonnegative().default(0),
  maxRetries: z.number().int().positive().default(5),
  dedupeKey: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type User = z.infer<typeof userSchema>;
export type Company = z.infer<typeof companySchema>;
export type Audit = z.infer<typeof auditSchema>;
export type AuditAuditor = z.infer<typeof auditAuditorSchema>;
export type AuditSME = z.infer<typeof auditSMESchema>;
export type AuditRequirement = z.infer<typeof auditRequirementSchema>;
export type Schedule = z.infer<typeof scheduleSchema>;
export type AuditorExpertise = z.infer<typeof auditorExpertiseSchema>;
export type Availability = z.infer<typeof availabilitySchema>;
export type AuditTemplate = z.infer<typeof auditTemplateSchema>;
export type Question = z.infer<typeof questionSchema>;
export type Finding = z.infer<typeof findingSchema>;
export type CorrectiveAction = z.infer<typeof correctiveActionSchema>;
export type Observation = z.infer<typeof observationSchema>;
export type Document = z.infer<typeof documentSchema>;
export type Notification = z.infer<typeof notificationSchema>;
export type EmailOutbox = z.infer<typeof emailOutboxSchema>;

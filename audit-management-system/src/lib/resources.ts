import { ObjectId } from "mongodb";
import {
  auditSchema,
  auditTemplateSchema,
  availabilitySchema,
  auditAuditorSchema,
  auditRequirementSchema,
  auditSMESchema,
  auditorExpertiseSchema,
  companySchema,
  correctiveActionSchema,
  documentSchema,
  emailOutboxSchema,
  findingSchema,
  notificationSchema,
  observationSchema,
  questionSchema,
  scheduleSchema,
  userSchema,
} from "./schemas";

type ResourceConfig = {
  collection: string;
  schema: any;
  objectIdFields?: string[];
  preprocessCreate?: (data: any) => any;
  preprocessUpdate?: (data: any) => any;
};

const now = () => new Date();

export const resourceConfigs: Record<string, ResourceConfig> = {
  companies: {
    collection: "companies",
    schema: companySchema,
    preprocessCreate: (data) => ({
      ...data,
      createdAt: data.createdAt ?? now(),
      updatedAt: data.updatedAt ?? now(),
    }),
    preprocessUpdate: (data) => ({ ...data, updatedAt: now() }),
  },
  audits: {
    collection: "audits",
    schema: auditSchema,
    objectIdFields: [
      "companyId",
      "auditeeId",
      "requestLetterId",
      "requestLetterSentById",
      "requestLetterAcceptedById",
      "reportLetterId",
      "reportLetterSentById",
      "reportLetterApprovedById",
      "closureLetterId",
    ],
    preprocessCreate: (data) => ({
      ...data,
      createdAt: data.createdAt ?? now(),
      updatedAt: data.updatedAt ?? now(),
    }),
    preprocessUpdate: (data) => ({ ...data, updatedAt: now() }),
  },
  audit_auditors: {
    collection: "audit_auditors",
    schema: auditAuditorSchema,
    objectIdFields: ["auditId", "auditorId"],
    preprocessCreate: (data) => ({
      ...data,
      createdAt: data.createdAt ?? now(),
      updatedAt: data.updatedAt ?? now(),
    }),
    preprocessUpdate: (data) => ({ ...data, updatedAt: now() }),
  },
  audit_smes: {
    collection: "audit_smes",
    schema: auditSMESchema,
    objectIdFields: ["auditId", "smeId"],
    preprocessCreate: (data) => ({
      ...data,
      createdAt: data.createdAt ?? now(),
      updatedAt: data.updatedAt ?? now(),
    }),
    preprocessUpdate: (data) => ({ ...data, updatedAt: now() }),
  },
  audit_requirements: {
    collection: "audit_requirements",
    schema: auditRequirementSchema,
    objectIdFields: ["auditId"],
    preprocessCreate: (data) => ({
      ...data,
      createdAt: data.createdAt ?? now(),
      updatedAt: data.updatedAt ?? now(),
    }),
    preprocessUpdate: (data) => ({ ...data, updatedAt: now() }),
  },
  schedules: {
    collection: "schedules",
    schema: scheduleSchema,
    objectIdFields: ["auditId", "auditorId"],
    preprocessCreate: (data) => ({
      deleted: false,
      ...data,
      createdAt: data.createdAt ?? now(),
      updatedAt: data.updatedAt ?? now(),
    }),
    preprocessUpdate: (data) => ({ ...data, updatedAt: now() }),
  },
  auditor_expertise: {
    collection: "auditor_expertise",
    schema: auditorExpertiseSchema,
    objectIdFields: ["auditorId"],
    preprocessCreate: (data) => ({
      verified: false,
      ...data,
      createdAt: data.createdAt ?? now(),
      updatedAt: data.updatedAt ?? now(),
    }),
    preprocessUpdate: (data) => ({ ...data, updatedAt: now() }),
  },
  availability: {
    collection: "availability",
    schema: availabilitySchema,
    objectIdFields: ["userId"],
    preprocessCreate: (data) => ({
      available: true,
      ...data,
      createdAt: data.createdAt ?? now(),
      updatedAt: data.updatedAt ?? now(),
    }),
    preprocessUpdate: (data) => ({ ...data, updatedAt: now() }),
  },
  audit_templates: {
    collection: "audit_templates",
    schema: auditTemplateSchema,
    preprocessCreate: (data) => ({
      ...data,
      createdAt: data.createdAt ?? now(),
      updatedAt: data.updatedAt ?? now(),
    }),
    preprocessUpdate: (data) => ({ ...data, updatedAt: now() }),
  },
  questions: {
    collection: "questions",
    schema: questionSchema,
    objectIdFields: ["templateId"],
    preprocessCreate: (data) => ({
      ...data,
      createdAt: data.createdAt ?? now(),
      updatedAt: data.updatedAt ?? now(),
    }),
    preprocessUpdate: (data) => ({ ...data, updatedAt: now() }),
  },
  findings: {
    collection: "findings",
    schema: findingSchema,
    objectIdFields: ["auditId", "questionId"],
    preprocessCreate: (data) => ({
      accepted: false,
      ...data,
      createdAt: data.createdAt ?? now(),
      updatedAt: data.updatedAt ?? now(),
    }),
    preprocessUpdate: (data) => ({ ...data, updatedAt: now() }),
  },
  corrective_actions: {
    collection: "corrective_actions",
    schema: correctiveActionSchema,
    objectIdFields: ["auditId", "findingId"],
    preprocessCreate: (data) => ({
      accepted: false,
      ...data,
      createdAt: data.createdAt ?? now(),
      updatedAt: data.updatedAt ?? now(),
    }),
    preprocessUpdate: (data) => ({ ...data, updatedAt: now() }),
  },
  observations: {
    collection: "observations",
    schema: observationSchema,
    objectIdFields: ["auditId", "authorId"],
    preprocessCreate: (data) => ({
      ...data,
      createdAt: data.createdAt ?? now(),
      updatedAt: data.updatedAt ?? now(),
    }),
    preprocessUpdate: (data) => ({ ...data, updatedAt: now() }),
  },
  documents: {
    collection: "documents",
    schema: documentSchema,
    objectIdFields: ["uploadedBy"],
    preprocessCreate: (data) => ({
      ...data,
      uploadedAt: data.uploadedAt ?? now(),
    }),
    preprocessUpdate: (data) => ({ ...data, updatedAt: now() }),
  },
  notifications: {
    collection: "notifications",
    schema: notificationSchema,
    objectIdFields: ["auditId"],
    preprocessCreate: (data) => ({
      ...data,
      createdAt: data.createdAt ?? now(),
      updatedAt: data.updatedAt ?? now(),
    }),
    preprocessUpdate: (data) => ({ ...data, updatedAt: now() }),
  },
  email_outbox: {
    collection: "email_outbox",
    schema: emailOutboxSchema,
    preprocessCreate: (data) => ({
      status: data.status ?? "QUEUED",
      retries: data.retries ?? 0,
      maxRetries: data.maxRetries ?? 5,
      ...data,
      createdAt: data.createdAt ?? now(),
      updatedAt: data.updatedAt ?? now(),
    }),
    preprocessUpdate: (data) => ({ ...data, updatedAt: now() }),
  },
  // Users have a dedicated route; include here only for completeness on GET/POST if needed.
  users_generic: {
    collection: "users",
    schema: userSchema,
    objectIdFields: ["companyId"],
    preprocessCreate: (data) => ({
      ...data,
      createdAt: data.createdAt ?? now(),
      updatedAt: data.updatedAt ?? now(),
    }),
    preprocessUpdate: (data) => ({ ...data, updatedAt: now() }),
  },
};

export const resolveObjectIdFields = (payload: any, fields?: string[]) => {
  if (!fields || !payload) return payload;
  const next = { ...payload };
  for (const key of fields) {
    if (next[key]) {
      try {
        next[key] = new ObjectId(next[key]);
      } catch (_err) {
        // leave as-is; validation will catch
      }
    }
  }
  return next;
};

// src/app/dashboard/schedule/page.tsx

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Auditee,
  AuditeeSection,
  AuditorSection,
  CompanySection,
  PrimaryActions,
  PurposeScopeSection,
  ReferenceSection,
  ScheduleHeader,
  SecondaryActions,
} from "./components";

export default function SchedulePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [reference, setReference] = useState("");
  const [startDate, setStartDate] = useState("");
  const [duration, setDuration] = useState<string | number>("");
  const [auditees, setAuditees] = useState<Auditee[]>([
    { id: "", name: "", contactEmail: "", contactNumber: "" },
  ]);
  const [leadAuditor, setLeadAuditor] = useState("");
  const [leadAuditorId, setLeadAuditorId] = useState("");
  const [supportAuditors, setSupportAuditors] = useState<string[]>([]);
  const [supportAuditorIds, setSupportAuditorIds] = useState<string[]>([]);
  const [purpose, setPurpose] = useState("");
  const [scope, setScope] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<{
    id?: string;
    name: string;
    address: string;
    auditAddress: string;
  }>({ id: "", name: "", address: "", auditAddress: "" });
  const [savingDraft, setSavingDraft] = useState(false);
  const [savingSchedule, setSavingSchedule] = useState(false);
  const [deletingDraft, setDeletingDraft] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const draftId = searchParams.get("draft");

  useEffect(() => {
    if (!draftId) return;
    let cancelled = false;

    const toDate = (value: any) => {
      if (!value) return null;
      if (typeof value === "string") {
        const parsed = new Date(value);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
      }
      if (value?.$date) {
        const parsed = new Date(value.$date);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
      }
      return null;
    };

    const formatDateTimeLocal = (date: Date) => {
      const offset = date.getTimezoneOffset();
      const local = new Date(date.getTime() - offset * 60_000);
      return local.toISOString().slice(0, 16);
    };

    const normalizeId = (value: any) => value?._id?.$oid ?? value?._id ?? value?.$oid ?? value ?? "";

    const loadDraft = async () => {
      try {
        const res = await fetch(`/api/audits/${draftId}`);
        if (!res.ok) return;
        const draft = await res.json();
        if (cancelled) return;

        setLeadAuditor("");
        setLeadAuditorId("");
        setSupportAuditors([]);
        setSupportAuditorIds([]);
        setPurpose("");
        setScope("");

        setReference(draft.reference ?? "");

        const proposedStart = toDate(draft.proposedStart ?? draft.expectedStart);
        const proposedEnd = toDate(draft.proposedEnd ?? draft.expectedEnd);
        if (proposedStart) {
          setStartDate(formatDateTimeLocal(proposedStart));
          if (proposedEnd) {
            const msDiff = proposedEnd.getTime() - proposedStart.getTime();
            const days = Math.max(1, Math.round(msDiff / (1000 * 60 * 60 * 24)));
            setDuration(days);
          } else {
            setDuration("");
          }
        } else {
          setStartDate("");
          setDuration("");
        }

        if (draft.companyId) {
          const companyId = normalizeId(draft.companyId);
          const companyRes = await fetch(`/api/companies/${companyId}`);
          if (companyRes.ok) {
            const company = await companyRes.json();
            if (!cancelled) {
              setSelectedCompany({
                id: companyId,
                name: company.name ?? "",
                address: company.address ?? "",
                auditAddress: company.auditAddress ?? "",
              });
            }
          } else if (!cancelled) {
            setSelectedCompany((prev) => ({ ...prev, id: companyId }));
          }
        }

        const draftAuditeeIds: string[] = [];
        if (Array.isArray(draft.auditeeIds) && draft.auditeeIds.length > 0) {
          draft.auditeeIds.forEach((id: any) => draftAuditeeIds.push(normalizeId(id)));
        } else if (draft.auditeeId) {
          draftAuditeeIds.push(normalizeId(draft.auditeeId));
        }

        if (draftAuditeeIds.length > 0) {
          const fetchedAuditees = await Promise.all(
            draftAuditeeIds.map(async (auditeeId) => {
              const auditeeRes = await fetch(`/api/users_generic/${auditeeId}`);
              if (!auditeeRes.ok) {
                return { id: auditeeId, name: "", contactEmail: "", contactNumber: "" };
              }
              const auditee = await auditeeRes.json();
              return {
                id: auditeeId,
                name: auditee.name ?? "",
                contactEmail: auditee.contactEmail ?? auditee.email ?? "",
                contactNumber: auditee.contactNumber ?? auditee.phoneNumber ?? "",
              };
            })
          );
          if (!cancelled) setAuditees(fetchedAuditees);
        }

        if (draft.leadAuditorId) {
          const leadId = normalizeId(draft.leadAuditorId);
          try {
            const leadRes = await fetch(`/api/users_generic/${leadId}`);
            if (leadRes.ok) {
              const lead = await leadRes.json();
              if (!cancelled) {
                setLeadAuditor(lead.name ?? "");
                setLeadAuditorId(leadId);
              }
            } else if (!cancelled) {
              setLeadAuditorId(leadId);
            }
          } catch (_err) {
            if (!cancelled) setLeadAuditorId(leadId);
          }
        }

        if (Array.isArray(draft.supportAuditorIds) && draft.supportAuditorIds.length > 0) {
          const normalizedSupportIds = draft.supportAuditorIds.map((id: any) => normalizeId(id));
          try {
            const fetchedSupport = await Promise.all(
              normalizedSupportIds.map(async (id: string) => {
                const res = await fetch(`/api/users_generic/${id}`);
                if (!res.ok) return { id, name: "" };
                const user = await res.json();
                return { id, name: user.name ?? "" };
              })
            );
            if (!cancelled) {
              setSupportAuditorIds(fetchedSupport.map((s) => s.id));
              setSupportAuditors(fetchedSupport.map((s) => s.name));
            }
          } catch (_err) {
            if (!cancelled) setSupportAuditorIds(normalizedSupportIds);
          }
        }

        if (!cancelled) {
          setPurpose(draft.purpose ?? "");
          setScope(draft.scope ?? "");
        }
      } catch (error) {
        console.error("Failed to load draft", error);
      }
    };

    loadDraft();
    return () => {
      cancelled = true;
    };
  }, [draftId]);

  const addAuditee = () =>
    setAuditees((prev) => [...prev, { id: "", name: "", contactEmail: "", contactNumber: "" }]);

  const updateAuditee = (
    index: number,
    field: "id" | "name" | "contactEmail" | "contactNumber",
    value: string
  ) => {
    setAuditees((prev) =>
      prev.map((auditee, i) => (i === index ? { ...auditee, [field]: value } : auditee))
    );
  };

  const addSupportAuditor = () => {
    setSupportAuditors((prev) => [...prev, ""]);
    setSupportAuditorIds((prev) => [...prev, ""]);
  };

  const updateSupportAuditor = (index: number, value: string) => {
    setSupportAuditorIds((prev) => {
      const next = [...prev];
      next[index] = "";
      return next;
    });
    setSupportAuditors((prev) => prev.map((auditor, i) => (i === index ? value : auditor)));
  };

  const updateSupportAuditorId = (index: number, id: string) => {
    setSupportAuditorIds((prev) => {
      const next = [...prev];
      next[index] = id;
      return next;
    });
  };

  const handleCompanySelectionChange = useCallback(
    (selection: { id?: string; name: string; address: string; auditAddress: string }) => {
      setSelectedCompany(selection);
    },
    []
  );

  const buildPayload = (isDraft: boolean) => {
    const formData = formRef.current ? new FormData(formRef.current) : new FormData();
    const reference = (formData.get("reference") as string) || "Draft reference";
    const startDate = (formData.get("startDate") as string) || "";
    const durationDays = Number(formData.get("duration") ?? 0);

    const payload: any = {
      reference,
      isDraft,
    };

    if (selectedCompany.id) {
      payload.companyId = selectedCompany.id;
    }

    const selectedAuditeeIds = auditees.map((a) => a.id).filter(Boolean);
    if (selectedAuditeeIds.length > 0) {
      payload.auditeeIds = selectedAuditeeIds;
      payload.auditeeId = selectedAuditeeIds[0];
    }

    if (purpose.trim()) payload.purpose = purpose.trim();
    if (scope.trim()) payload.scope = scope.trim();

    if (leadAuditorId) {
      payload.leadAuditorId = leadAuditorId;
    }

    const supportIds = supportAuditorIds.filter(Boolean);
    if (supportIds.length > 0) {
      payload.supportAuditorIds = supportIds;
    }

    if (startDate) {
      const start = new Date(startDate);
      if (isDraft) {
        payload.proposedStart = start;
      } else {
        payload.expectedStart = start;
      }
      if (!Number.isNaN(durationDays) && durationDays > 0) {
        const end = new Date(start);
        end.setDate(end.getDate() + durationDays);
        if (isDraft) {
          payload.proposedEnd = end;
        } else {
          payload.expectedEnd = end;
        }
      }
    }

    return payload;
  };

  const persistAudit = async (payload: any, onComplete: () => void) => {
    const res = await fetch(draftId ? `/api/audits/${draftId}` : "/api/audits", {
      method: draftId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      console.error("Failed to save audit", error);
      alert("Failed to save. Please try again.");
      return false;
    }
    onComplete();
    return true;
  };

  const handleSaveDraft = async () => {
    try {
      if (savingDraft) return;
      const payload = buildPayload(true);
      setSavingDraft(true);
      const ok = await persistAudit(payload, () =>
        alert(draftId ? "Draft updated successfully." : "Draft saved successfully.")
      );
      if (!ok) return;
    } catch (err) {
      console.error(err);
      alert("Failed to save draft. Please try again.");
    } finally {
      setSavingDraft(false);
    }
  };

  const handleAddToSchedule = async () => {
    try {
      if (savingSchedule) return;
      const payload = buildPayload(false);
      setSavingSchedule(true);
      const ok = await persistAudit(payload, () =>
        alert(draftId ? "Audit updated and added to schedule." : "Audit added to schedule.")
      );
      if (!ok) return;
    } catch (err) {
      console.error(err);
      alert("Failed to add to schedule. Please try again.");
    } finally {
      setSavingSchedule(false);
    }
  };

  const handleDeleteDraft = async () => {
    if (!draftId || deletingDraft) return;
    const confirmed = confirm("Delete this draft? This action cannot be undone.");
    if (!confirmed) return;
    try {
      setDeletingDraft(true);
      const res = await fetch(`/api/audits/${draftId}`, { method: "DELETE" });
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        console.error("Failed to delete draft", error);
        alert("Failed to delete draft. Please try again.");
        return;
      }
      alert("Draft deleted successfully.");
      router.push("/dashboard/drafts");
    } catch (err) {
      console.error(err);
      alert("Failed to delete draft. Please try again.");
    } finally {
      setDeletingDraft(false);
    }
  };

  return (
    <div className="min-h-full w-full bg-background text-foreground flex items-center justify-center px-4 md:px-8 lg:px-12 py-10">
      <div className="w-full max-w-5xl rounded-2xl border-3 border-foreground bg-background/80 shadow-xl p-6 md:p-10 space-y-8">
        <ScheduleHeader />

        <form className="space-y-7" ref={formRef}>
          <ReferenceSection
            reference={reference}
            startDate={startDate}
            duration={duration}
            onReferenceChange={setReference}
            onStartDateChange={setStartDate}
            onDurationChange={setDuration}
          />

          <CompanySection
            onSelectionChange={handleCompanySelectionChange}
            initialSelection={selectedCompany}
          />

          <AuditeeSection
            auditees={auditees}
            addAuditee={addAuditee}
            updateAuditee={updateAuditee}
            selectedAuditorNames={[leadAuditor, ...supportAuditors]}
          />

          <AuditorSection
            leadAuditor={leadAuditor}
            updateLeadAuditor={setLeadAuditor}
            leadAuditorId={leadAuditorId}
            updateLeadAuditorId={setLeadAuditorId}
            supportAuditors={supportAuditors}
            supportAuditorIds={supportAuditorIds}
            addSupportAuditor={addSupportAuditor}
            updateSupportAuditor={updateSupportAuditor}
            updateSupportAuditorId={updateSupportAuditorId}
            auditeeNames={auditees.map((a) => a.name)}
          />

          <PurposeScopeSection
            purpose={purpose}
            scope={scope}
            onPurposeChange={setPurpose}
            onScopeChange={setScope}
          />

          <PrimaryActions onAddToSchedule={handleAddToSchedule} savingSchedule={savingSchedule} />

          <SecondaryActions
            onSaveDraft={handleSaveDraft}
            savingDraft={savingDraft}
            onDeleteDraft={draftId ? handleDeleteDraft : undefined}
            deletingDraft={deletingDraft}
          />
        </form>
      </div>
    </div>
  );
}

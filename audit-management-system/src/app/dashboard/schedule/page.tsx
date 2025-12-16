'use client';

import { useCallback, useRef, useState } from "react";
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
  const [auditees, setAuditees] = useState<Auditee[]>([
    { id: "", name: "", contactEmail: "", contactNumber: "" },
  ]);
  const [leadAuditor, setLeadAuditor] = useState("");
  const [supportAuditors, setSupportAuditors] = useState<string[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<{
    id?: string;
    name: string;
    address: string;
    auditAddress: string;
  }>({ id: "", name: "", address: "", auditAddress: "" });
  const [savingDraft, setSavingDraft] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

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

  const addSupportAuditor = () => setSupportAuditors((prev) => [...prev, ""]);

  const updateSupportAuditor = (index: number, value: string) => {
    setSupportAuditors((prev) => prev.map((auditor, i) => (i === index ? value : auditor)));
  };

  const handleCompanySelectionChange = useCallback(
    (selection: { id?: string; name: string; address: string; auditAddress: string }) => {
      setSelectedCompany(selection);
    },
    []
  );

  const handleSaveDraft = async () => {
    try {
      if (savingDraft) return;
      const formData = formRef.current ? new FormData(formRef.current) : new FormData();
      const reference = (formData.get("reference") as string) || "Draft reference";
      const startDate = (formData.get("startDate") as string) || "";
      const durationDays = Number(formData.get("duration") ?? 0);

      const payload: any = {
        reference,
        isDraft: true,
      };

      if (selectedCompany.id) {
        payload.companyId = selectedCompany.id;
      }

      const primaryAuditee = auditees.find((a) => a.id);
      if (primaryAuditee?.id) {
        payload.auditeeId = primaryAuditee.id;
      }

      if (startDate) {
        const start = new Date(startDate);
        payload.expectedStart = start;
        if (!Number.isNaN(durationDays) && durationDays > 0) {
          const end = new Date(start);
          end.setDate(end.getDate() + durationDays);
          payload.expectedEnd = end;
        }
      }

      setSavingDraft(true);
      const res = await fetch("/api/audits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        console.error("Failed to save draft", error);
        alert("Failed to save draft. Please try again.");
        return;
      }
      alert("Draft saved successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to save draft. Please try again.");
    } finally {
      setSavingDraft(false);
    }
  };

  return (
    <div className="min-h-full w-full bg-background text-foreground flex items-center justify-center px-4 md:px-8 lg:px-12 py-10">
      <div className="w-full max-w-5xl rounded-2xl border-3 border-foreground bg-background/80 shadow-xl p-6 md:p-10 space-y-8">
        <ScheduleHeader />

        <form className="space-y-7" ref={formRef}>
          <ReferenceSection />

          <CompanySection
            onSelectionChange={handleCompanySelectionChange}
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
            supportAuditors={supportAuditors}
            addSupportAuditor={addSupportAuditor}
            updateSupportAuditor={updateSupportAuditor}
            auditeeNames={auditees.map((a) => a.name)}
          />

          <PurposeScopeSection />

          <PrimaryActions />

          <SecondaryActions onSaveDraft={handleSaveDraft} savingDraft={savingDraft} />
        </form>
      </div>
    </div>
  );
}

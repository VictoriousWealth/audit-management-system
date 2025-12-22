'use client';

import { useEffect, useRef, useState } from "react";

type CompanySelection = {
  id?: string;
  name: string;
  address: string;
  auditAddress: string;
};

type CompanySectionProps = {
  onSelectionChange?: (selection: CompanySelection) => void;
  initialSelection?: CompanySelection;
};

export function CompanySection({ onSelectionChange, initialSelection }: CompanySectionProps) {
  const [showAuditAddress, setShowAuditAddress] = useState(false);
  const [auditAddress, setAuditAddress] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [companies, setCompanies] = useState<
    { _id?: string; name: string; address?: string }[]
  >([]);
  const [loadingCompanies, setLoadingCompanies] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const companyInputWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const loadCompanies = async () => {
      try {
        setLoadingCompanies(true);
        const res = await fetch("/api/companies");
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && Array.isArray(data)) {
          setCompanies(data);
        }
      } catch (_err) {
        // ignore fetch errors; UI will show empty state
      } finally {
        if (!cancelled) setLoadingCompanies(false);
      }
    };
    loadCompanies();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    onSelectionChange?.({
      id: selectedCompanyId,
      name: companyName,
      address: companyAddress,
      auditAddress: showAuditAddress ? auditAddress : "",
    });
  }, [auditAddress, companyAddress, companyName, onSelectionChange, selectedCompanyId, showAuditAddress]);

  useEffect(() => {
    if (!initialSelection) return;
    setSelectedCompanyId(initialSelection.id ?? "");
    setCompanyName(initialSelection.name ?? "");
    setCompanyAddress(initialSelection.address ?? "");
    setAuditAddress(initialSelection.auditAddress ?? "");
    setShowAuditAddress(Boolean(initialSelection.auditAddress));
  }, [initialSelection?.id]);

  const filteredCompanies = companyName.trim()
    ? companies.filter((company) =>
        company.name.toLowerCase().includes(companyName.toLowerCase())
      )
    : companies;

  return (
    <>
      <div className="flex gap-4">
        <label className="flex flex-col gap-2 w-3xs">
          <span className="text-sm font-medium">Company name</span>
          <div className="relative" ref={companyInputWrapperRef}>
            <input
              type="text"
              name="companyName"
              placeholder="Company / Site name"
              value={companyName}
            onChange={(e) => {
              setCompanyName(e.target.value);
              setSelectedCompanyId("");
              setShowSuggestions(true);
            }}
            onFocus={() => {
              if (companyName.trim()) setShowSuggestions(true);
            }}
              onBlur={(e) => {
                const next = e.relatedTarget;
                if (next && companyInputWrapperRef.current?.contains(next)) {
                  return;
                }
                setShowSuggestions(false);
              }}
              className="border-2 border-border rounded-lg px-3 py-2 bg-surface/70 focus:outline-none focus:ring-2 focus:ring-primary w-full"
            />
            {loadingCompanies && (
              <p className="text-xs text-muted-foreground">Loading companies…</p>
            )}
            {!loadingCompanies && companyName && filteredCompanies.length === 0 && (
              <p className="text-xs text-red-500">
                No companies found. A company must be registered before scheduling an audit.
              </p>
            )}
            {!loadingCompanies && showSuggestions && companyName && filteredCompanies.length > 0 && (
              <div className="absolute z-10 mt-1 max-h-48 w-72 overflow-y-auto rounded-lg border border-border bg-background shadow-lg">
                {filteredCompanies.slice(0, 8).map((company) => (
                  <button
                    type="button"
                    key={company._id ?? company.name}
                    onClick={() => {
                      setCompanyName(company.name);
                      setCompanyAddress(company.address ?? "");
                      setSelectedCompanyId(company._id ?? "");
                      setShowSuggestions(false);
                    }}
                    className="flex w-full flex-col items-start gap-1 px-3 py-2 text-left text-sm hover:bg-surface"
                  >
                    <span className="font-medium">{company.name}</span>
                    {company.address && (
                      <span className="text-xs text-muted-foreground">
                        {company.address}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </label>
      </div>

      <div className="flex gap-8 items-start w-4xl pr-14">
        <label className="flex flex-col gap-2 w-full">
          <span className="text-sm font-medium">Company address</span>
          <textarea
            name="companyAddress"
            rows={4}
            placeholder="Street, City, Country"
            value={companyAddress}
            onChange={(e) => setCompanyAddress(e.target.value)}
            className="border-2 border-border rounded-xl px-3 py-3 bg-surface/70 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </label>
        <div className="flex flex-col gap-3 w-fit">
          <span className="text-sm font-medium">Audit address (optional)</span>
          {!showAuditAddress ? (
            <button
              type="button"
              onClick={() => setShowAuditAddress(true)}
              className="border-3 px-4 py-3 rounded-lg text-sm font-semibold hover:text-background hover:bg-primary border-primary bg-background text-primary hover:cursor-pointer text-nowrap"
            >
              + Add audit address if different
            </button>
          ) : (
            <div className="flex flex-col gap-3 w-80">
              <textarea
                name="auditAddress"
                rows={4}
                placeholder="Street, City, Country"
                value={auditAddress}
                onChange={(e) => setAuditAddress(e.target.value)}
                className="border-2 border-border rounded-xl px-3 py-3 bg-surface/70 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
              <button
                type="button"
                onClick={() => {
                  setShowAuditAddress(false);
                  setAuditAddress("");
                }}
                className="border-3 px-4 py-3 rounded-lg text-sm font-semibold hover:text-background hover:bg-primary border-primary bg-background text-primary hover:cursor-pointer text-nowrap"
              >
                Remove audit address
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

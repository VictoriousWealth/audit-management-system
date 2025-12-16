export function PurposeScopeSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium">Audit purpose</span>
        <textarea
          name="purpose"
          rows={4}
          placeholder="Why this audit is being performed"
          className="border-2 border-border rounded-xl px-3 py-3 bg-surface/70 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium">Audit scope</span>
        <textarea
          name="scope"
          rows={4}
          placeholder="Processes, sites, or standards covered"
          className="border-2 border-border rounded-xl px-3 py-3 bg-surface/70 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
      </label>
    </div>
  );
}

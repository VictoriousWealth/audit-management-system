export function ReferenceSection() {
  return (
    <div className="w-full flex flex-row justify-between gap-4">
      <label className="flex flex-col gap-2 w-56">
        <span className="text-sm font-medium">Reference</span>
        <input
          type="text"
          name="reference"
          placeholder="Internal reference or code"
          className="border-2 border-border rounded-lg px-3 py-2 bg-surface/70 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </label>
      <label className="flex flex-col gap-2 w-52">
        <span className="text-sm font-medium">Start date</span>
        <input
          type="datetime-local"
          name="startDate"
          className="border-2 border-border rounded-lg px-3 py-2 bg-surface/70 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium">Duration (days)</span>
        <input
          type="number"
          name="duration"
          min={1}
          className="border-2 border-border rounded-lg px-3 py-2 bg-surface/70 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </label>
    </div>
  );
}

type PrimaryActionsProps = {
  onAddToSchedule?: () => void;
  savingSchedule?: boolean;
};

export function PrimaryActions({ onAddToSchedule, savingSchedule }: PrimaryActionsProps) {
  return (
    <>
      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={onAddToSchedule}
          disabled={savingSchedule}
          className="border-3 px-3 py-3 rounded-lg text-sm font-semibold border-success bg-success text-background hover:cursor-pointer hover:opacity-70"
        >
          {savingSchedule ? "Saving..." : "Add to Schedule"}
        </button>
        <button
          type="button"
          className="border-3 px-3 py-3 rounded-lg text-sm font-semibold hover:text-background hover:bg-primary border-primary bg-background text-primary hover:cursor-pointer"
        >
          Create Request Letter
        </button>
        <button
          type="button"
          className="border-3 px-3 py-3 rounded-lg text-sm font-semibold hover:text-background hover:bg-primary border-primary bg-background text-primary hover:cursor-pointer"
        >
          Create Agenda
        </button>
      </div>
{/* 
      <button
        type="button"
        className="w-full border-3 px-4 py-3 rounded-lg text-base font-semibold bg-primary text-background hover:opacity-90 border-primary"
      >
        Start Audit
      </button> */}
    </>
  );
}

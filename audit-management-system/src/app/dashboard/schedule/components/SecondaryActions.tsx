"use client";

import { useRouter } from "next/navigation";

type SecondaryActionsProps = {
  onSaveDraft: () => void;
  savingDraft?: boolean;
  onDeleteDraft?: () => void;
  deletingDraft?: boolean;
};

export function SecondaryActions({
  onSaveDraft,
  savingDraft = false,
  onDeleteDraft,
  deletingDraft = false,
}: SecondaryActionsProps) {
  const router = useRouter();

  const handleCancel = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/dashboard");
  };

  return (
    <>
      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <button
          type="button"
          className="border-3 px-3 py-3 rounded-lg text-sm font-semibold hover:text-background hover:bg-primary border-primary bg-background text-primary hover:cursor-pointer"
        >
          View Audit Report
        </button>
        <button
          type="button"
          className="border-3 px-3 py-3 rounded-lg text-sm font-semibold hover:text-background hover:bg-primary border-primary bg-background text-primary hover:cursor-pointer"
        >
          View CAPA
        </button>
      </div>

      <button
        type="button"
        className="w-full border-3 px-4 py-3 rounded-lg text-base font-semibold bg-error text-background border-erbg-error hover:cursor-pointer hover:opacity-70"
      >
        Close Audit
      </button> */}

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 rounded-lg border border-border text-sm md:text-base font-semibold hover:border-foreground"
        >
          Cancel
        </button>
        {onDeleteDraft && (
          <button
            type="button"
            onClick={onDeleteDraft}
            disabled={deletingDraft}
            className="border-3 px-4 py-2 rounded-lg text-sm font-semibold border-error bg-error text-background hover:cursor-pointer hover:opacity-80 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {deletingDraft ? "Deleting..." : "Delete Draft"}
          </button>
        )}
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={savingDraft}
          className="border-3 px-5 py-2 rounded-lg text-sm font-semibold border-warning bg-warning text-background hover:cursor-pointer hover:text-warning hover:bg-background disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {savingDraft ? "Saving..." : "Save Draft"}
        </button>
      </div>
    </>
  );
}

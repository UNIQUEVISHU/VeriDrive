import { Info } from "lucide-react";

export function DemoModeBanner() {
  return (
    <div className="mx-6 mb-4 flex items-center gap-2 rounded-lg border border-amber-400/20 bg-amber-400/5 px-4 py-2 text-xs text-amber-300 lg:mx-10">
      <Info className="h-3.5 w-3.5 shrink-0" />
      <span>
        Demo mode: sensor streams are simulated for this walkthrough. Inference logic and model
        architecture reflect the intended production pipeline.
      </span>
    </div>
  );
}
"use client";
import { useEffect, useState } from "react";
import { useFleetContext } from "@/app/providers";
import { Badge } from "@/components/ui/badge";

export function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  const { vehicles, tick } = useFleetContext();
  const [now, setNow] = useState<string>("");

  useEffect(() => {
    const update = () =>
      setNow(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const critical = vehicles.filter((v) => v.severity === "critical").length;
  const warning = vehicles.filter((v) => v.severity === "warning").length;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-neutral-950/60 px-6 py-5 backdrop-blur-xl lg:px-10">
      <div>
        <h1 className="font-display text-xl font-semibold text-neutral-50">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-neutral-500">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <Badge variant={critical > 0 ? "critical" : warning > 0 ? "warning" : "normal"}>
          <span className="h-1.5 w-1.5 rounded-full bg-current" />
          {critical > 0 ? `${critical} critical` : warning > 0 ? `${warning} warnings` : "Fleet nominal"}
        </Badge>
        <div className="hidden font-mono text-xs text-neutral-500 sm:block">
          cycle #{tick.toString().padStart(4, "0")} · {now} IST
        </div>
      </div>
    </div>
  );
}

"use client";
import { AlertTriangle, Siren, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AlertItem } from "@/lib/types";
import { motion } from "framer-motion";

const ICON = { normal: Info, warning: AlertTriangle, critical: Siren };

export function AlertRow({ alert, index = 0 }: { alert: AlertItem; index?: number }) {
  const Icon = ICON[alert.severity];
  const iconTone = {
    normal: "text-teal-300 bg-teal-400/10",
    warning: "text-amber-300 bg-amber-400/10",
    critical: "text-red-300 bg-red-400/10",
  }[alert.severity];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <Card className="flex items-start gap-4 p-4">
        <div className={`mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-lg ${iconTone}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium text-neutral-100">
              {alert.vehicleName} <span className="text-neutral-500">· {alert.vehicleId}</span>
            </p>
            <Badge variant={alert.severity}>{alert.severity}</Badge>
          </div>
          <p className="mt-1 text-sm text-neutral-400">{alert.message}</p>
          <p className="mt-1.5 text-xs text-neutral-500">
            <span className="text-neutral-400">Recommended:</span> {alert.recommendation}
          </p>
        </div>
        <span className="flex-none whitespace-nowrap text-[11px] text-neutral-500">{alert.timestamp}</span>
      </Card>
    </motion.div>
  );
}

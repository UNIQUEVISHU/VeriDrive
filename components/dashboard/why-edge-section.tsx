import { WifiOff, ShieldCheck, Gauge } from "lucide-react";
import { SectionHeading } from "@/components/dashboard/section-heading";
import { InfiniteMovingCards } from "@/components/aceternity/infinite-moving-cards";

const REASONS = [
  {
    icon: <WifiOff className="h-5 w-5" />,
    title: "Connectivity-optional by design",
    desc: "Highways, tunnels, and remote industrial routes in India often have patchy network. VeriDrive's models run on-device, so failure detection never depends on signal strength.",
  },
  {
    icon: <Gauge className="h-5 w-5" />,
    title: "Sub-second decisions",
    desc: "Round-tripping every sensor reading to the cloud adds latency. On-device inference flags a critical anomaly the moment it happens, not after a network call.",
  },
  {
    icon: <ShieldCheck className="h-5 w-5" />,
    title: "Bandwidth and data sovereignty",
    desc: "Only anomaly summaries sync to the cloud, not raw sensor streams. This cuts bandwidth costs and keeps sensitive fleet data closer to the vehicle.",
  },
];

export function WhyEdgeSection() {
  return (
    <section className="px-6 pb-10 lg:px-10">
      <SectionHeading
        eyebrow="Why edge, why now"
        title="Cloud-first platforms break where it matters most"
        description="Existing predictive maintenance tools assume constant connectivity. VeriDrive doesn't."
      />
      <InfiniteMovingCards items={REASONS} direction="left" speed="slow" />
    </section>
  );
}
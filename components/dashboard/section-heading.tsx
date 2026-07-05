interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "between";
  action?: React.ReactNode;
}

export function SectionHeading({ eyebrow, title, description, align = "left", action }: SectionHeadingProps) {
  return (
    <div
      className={`mb-4 flex flex-col gap-2 ${
        align === "between" ? "sm:flex-row sm:items-end sm:justify-between" : ""
      }`}
    >
      <div>
        <span className="text-[11px] font-medium uppercase tracking-wider text-teal-400/80">{eyebrow}</span>
        <h3 className="mt-1 font-display text-lg font-semibold text-neutral-50">{title}</h3>
        {description && <p className="mt-1 max-w-xl text-sm text-neutral-500">{description}</p>}
      </div>
      {action}
    </div>
  );
}
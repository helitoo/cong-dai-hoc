import { Info, Lightbulb, CircleAlert } from "lucide-react";
import { ReactNode } from "react";
import clsx from "clsx";

type QuoteType = "note" | "tip" | "warning";

type QuoteProps = {
  type: QuoteType;
  title?: string;
  className?: string;
  children?: ReactNode;
};

// Helper
function getQuoteTitle(type: QuoteType) {
  switch (type) {
    case "note":
      return "Ghi chú";
    case "tip":
      return "Mẹo";
    case "warning":
      return "Chú ý";
    default:
      return "Thông tin";
  }
}

export default function Quote({
  type,
  title = getQuoteTitle(type),
  className = "",
  children = <></>,
}: QuoteProps) {
  const styles = {
    note: {
      border: "border-l-5 border-muted-foreground",
      bg: "bg-muted",
      title: "text-foreground",
      content: "text-muted-foreground",
      icon: <Info className="size-5 text-foreground" />,
    },
    tip: {
      border: "border-l-5 border-blue-500",
      bg: "bg-blue-500/10",
      title: "text-blue-700",
      content: "text-blue-600",
      icon: <Lightbulb className="size-5 text-blue-700" />,
    },
    warning: {
      border: "border-l-5 border-red-500",
      bg: "bg-red-500/10",
      title: "text-red-700",
      content: "text-red-600",
      icon: <CircleAlert className="size-5 text-red-700" />,
    },
  } as const;

  const variant = styles[type];

  return (
    <div
      className={clsx(
        variant.border,
        variant.bg,
        "p-2 mt-3 text-justify",
        className
      )}
    >
      <div className="flex items-center gap-1">
        {variant.icon}
        <p className={clsx("font-semibold", variant.title)}>{title}</p>
      </div>

      <div className={clsx("mt-1 text-sm p-2", variant.content)}>
        {children}
      </div>
    </div>
  );
}

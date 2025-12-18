import { cn } from "@/lib/utils";
import { Fragment } from "react/jsx-runtime";

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "bg-muted text-muted-foreground pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-sm px-1 font-sans text-xs font-medium select-none",
        "[&_svg:not([class*='size-'])]:size-3",
        "[[data-slot=tooltip-content]_&]:bg-background/20 [[data-slot=tooltip-content]_&]:text-background dark:[[data-slot=tooltip-content]_&]:bg-background/10",
        className
      )}
      {...props}
    />
  );
}

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1", className)}
      {...props}
    />
  );
}

export function KbdGroupFrom({
  keys,
  getPlusSymbol = false,
}: {
  keys: string[];
  getPlusSymbol?: boolean;
}) {
  // Helper
  function getKeySymbol(key: string) {
    const tempKey = key.toLowerCase();

    switch (tempKey) {
      case "ctrl":
      case "command":
      case "cmd":
        return "⌘";
      case "alt":
      case "option":
        return "⌥";
      case "shift":
        return "⇧";
      default:
        return key;
    }
  }

  return (
    <KbdGroup>
      {keys.map((k, idx) => (
        <Fragment key={idx}>
          <Kbd>{getKeySymbol(k)}</Kbd>
          {getPlusSymbol && idx < keys.length - 1 && <span>+</span>}
        </Fragment>
      ))}
    </KbdGroup>
  );
}

export { Kbd, KbdGroup };

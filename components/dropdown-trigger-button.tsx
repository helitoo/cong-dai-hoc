import { ChevronDown } from "lucide-react";
import React, { forwardRef } from "react";
import { Button } from "@/components/ui/button";

const DropdownTriggerBtn = forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(function DropdownTriggerBtn({ children, className, ...props }, ref) {
  return (
    <Button
      ref={ref}
      className={`p-0 flex items-center gap-0 ${className ?? ""}`}
      {...props}
    >
      {children}
      <ChevronDown className="size-3 opacity-30 ml-1/2" />
    </Button>
  );
});

export default DropdownTriggerBtn;

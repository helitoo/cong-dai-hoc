import { Check } from "lucide-react";

import React, { useState, ReactNode } from "react";

import { Button } from "@/components/ui/button";

type ToggleButtonProps = {
  notExeIcon: ReactNode;
  exeIcon?: ReactNode;
  onClick?: () => void;
};

export default function ToggleButton({
  notExeIcon,
  exeIcon = <Check className="button-icon text-green-500" />,
  onClick = () => {},
  ...rest
}: ToggleButtonProps & React.ComponentProps<typeof Button>) {
  const [executing, setExecuting] = useState(false);

  function swapIcon() {
    setExecuting(true);
    setTimeout(() => {
      setExecuting(false);
    }, 1700);
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        swapIcon();
        onClick();
      }}
      {...rest}
    >
      {executing ? exeIcon : notExeIcon}
    </Button>
  );
}

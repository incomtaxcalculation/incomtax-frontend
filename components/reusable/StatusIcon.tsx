import { validate, ValidationType } from "@/lib/validation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type StatusIconProps = {
  condition?: boolean;
  value?: string;
  type?: ValidationType;
  length?: number;
  trueIcon?: React.ReactNode;
  falseIcon?: React.ReactNode;
  trueClass?: string;
  falseClass?: string;
};

const StatusIcon: React.FC<StatusIconProps> = ({
  condition,
  value,
  type,
  length,
  trueIcon = "✓",
  falseIcon = "*",
  trueClass = "text-green-500",
  falseClass = "text-red-500",
}) => {
  const result =
    type && value !== undefined
      ? validate(value, type, length)
      : { valid: !!condition, message: "" };

  if (result.valid) {
    return (
      <span className={`${trueClass} font-bold text-[16px] p-0`}>
        {trueIcon}
      </span>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`${falseClass} font-bold text-[16px] p-0 cursor-help`}>
            {falseIcon}
          </span>
        </TooltipTrigger>
        <TooltipContent side="right">
          {result.message}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default StatusIcon;

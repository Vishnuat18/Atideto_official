import React from "react";
import { checkPasswordRequirements } from "@/lib/utils";

interface PasswordRequirementsProps {
  password: string;
  className?: string;
  compact?: boolean;
}

export function PasswordRequirements({
  password,
  className = "",
  compact = false,
}: PasswordRequirementsProps) {
  const reqs = checkPasswordRequirements(password);

  const criteria = [
    { id: "len", label: "8+ characters", met: reqs.hasMinLength },
    { id: "upper", label: "1 uppercase (A-Z)", met: reqs.hasUppercase },
    { id: "num", label: "1 number (0-9)", met: reqs.hasNumber },
    { id: "sym", label: "1 symbol (!@#$)", met: reqs.hasSymbol },
  ];

  return (
    <div className={`w-full ${className}`}>
      <div className={`grid grid-cols-2 gap-1.5 ${compact ? "text-[10px]" : "text-[11px]"}`}>
        {criteria.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border transition-all duration-200 ${
              item.met
                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                : "bg-white/[0.03] text-slate-400 border-white/[0.08]"
            }`}
          >
            <span
              className={`size-1.5 rounded-full shrink-0 transition-all duration-200 ${
                item.met
                  ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]"
                  : "bg-slate-600"
              }`}
            />
            <span className="truncate font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

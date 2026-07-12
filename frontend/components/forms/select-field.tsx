import { UseFormRegisterReturn } from "react-hook-form";

interface SelectFieldProps {
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function SelectField({
  label,
  registration,
  error,
  options,
  placeholder = "Select...",
}: SelectFieldProps) {
  return (
    <div>
      <label className="text-sm text-white/70">{label}</label>
      <select
        {...registration}
        defaultValue=""
        className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none transition focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20"
      >
        <option value="" disabled className="bg-neutral-900">
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-neutral-900">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
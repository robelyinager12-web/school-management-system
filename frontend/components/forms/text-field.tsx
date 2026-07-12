import { UseFormRegisterReturn } from "react-hook-form";

interface TextFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  registration: UseFormRegisterReturn;
  error?: string;
}

export function TextField({
  label,
  type = "text",
  placeholder,
  registration,
  error,
}: TextFieldProps) {
  return (
    <div>
      <label className="text-sm text-white/70">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        {...registration}
        className="mt-1 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none transition focus:border-purple-400/50 focus:ring-2 focus:ring-purple-400/20"
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
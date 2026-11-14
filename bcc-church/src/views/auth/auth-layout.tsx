import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import authBg from "@/assets/photos/bcc-church.jpeg";

/**
 * BizTrack-style auth shell: split screen with a photo panel.
 * Left: centered white card (app name / greeting / instruction / form).
 * Right (desktop): full-height photo with rounded left edge + quote card.
 * Mobile: photo becomes a full-screen backdrop behind a frosted card.
 */

const QUOTE = "Raising Kingdom Champions — one soul, one family, one community at a time.";

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="relative grid min-h-screen bg-gray-100 lg:grid-cols-2">
      {/* Mobile backdrop */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center lg:hidden"
        style={{ backgroundImage: `url(${authBg})` }}
      />
      <div aria-hidden className="absolute inset-0 bg-black/20 lg:hidden" />

      {/* Form side */}
      <div className="relative z-10 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md rounded-2xl border border-white/30 bg-white/95 p-5 shadow-xl backdrop-blur-sm sm:p-6 lg:rounded-xl lg:border-gray-300 lg:bg-white lg:shadow-md lg:backdrop-blur-none">
          <h2 className="mb-0.5 text-left text-lg font-semibold">{eyebrow}</h2>
          <h1 className="mb-2 mt-2 text-left text-2xl font-bold text-gray-700">{title}</h1>
          <p className="mb-4 text-left text-[13px] text-gray-600">{subtitle}</p>
          {children}
          <div className="mb-1 mt-4 text-center">
            <AuthFooter />
          </div>
        </div>
      </div>

      {/* Photo side */}
      <div
        aria-hidden
        className="hidden h-full flex-col justify-end bg-cover bg-center lg:flex"
        style={{
          backgroundImage: `url(${authBg})`,
          borderTopLeftRadius: "40px",
          borderBottomLeftRadius: "40px",
        }}
      >
        <div className="mx-auto mb-10 max-w-md rounded-xl bg-white p-6 shadow-md">
          <span className="p-3 text-xl font-bold text-[#111827]">{QUOTE}</span>
        </div>
      </div>
    </div>
  );
}

/* ---------- BizTrack TextInput: grey fill, 12px bold label, red error row ---------- */

interface AuthTextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: boolean;
  errorMessage?: string;
}

export function AuthTextInput({ id, label, error, errorMessage, ...rest }: AuthTextInputProps) {
  return (
    <div className="mb-[18px]">
      <label htmlFor={id} className="mb-1 block text-[12px] font-bold leading-4 text-[#353f50]">
        {label}
      </label>
      <input
        id={id}
        {...rest}
        className={`w-full rounded border px-3 py-2 text-[13px] text-[#353f50] outline-none transition placeholder:text-[#848f9f] focus:outline focus:outline-1 focus:outline-offset-0 ${
          error
            ? "border-[#dc4437] bg-[#f8f8f8]"
            : "border-gray-300 bg-[#f8f8f8] focus:outline-primary"
        }`}
      />
      {error && errorMessage ? (
        <div className="mt-1 flex items-center text-[12px] leading-5 text-[#dc4437]">
          <AlertCircle size={12} className="mr-[5px] shrink-0" />
          <span>{errorMessage}</span>
        </div>
      ) : null}
    </div>
  );
}

/* ---------- BizTrack PasswordInput: bordered + eye toggle + primary focus ring ---------- */

export function AuthPasswordInput({
  id,
  label,
  error,
  errorMessage,
  value,
  onChange,
  placeholder,
  autoComplete,
  ...rest
}: {
  id: string;
  label: string;
  error?: boolean;
  errorMessage?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  autoComplete?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type">) {
  const [show, setShow] = useState(false);
  const [focused, setFocused] = useState(false);
  return (
    <div className="mb-4 w-full">
      <div className="mb-1">
        <label htmlFor={id} className="text-[13px] font-bold leading-4 text-[#353f50]">
          {label}
        </label>
      </div>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          {...rest}
          className={`w-full rounded-lg border py-2 pl-3 pr-10 text-[13px] shadow-sm focus:outline-none ${
            error ? "border-red-500" : "border-gray-300"
          }`}
          style={
            focused && !error
              ? { borderColor: "#0e2a52", boxShadow: "0 0 0 2px #0e2a5233" }
              : undefined
          }
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-3 top-2.5 cursor-pointer text-primary"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && errorMessage ? <p className="mt-1 text-sm text-red-500">{errorMessage}</p> : null}
    </div>
  );
}

/* ---------- BizTrack FormButton: validation-gated, loading state ---------- */

export function AuthSubmitButton({
  loading,
  disabled,
  children,
  testId,
}: {
  loading?: boolean;
  disabled?: boolean;
  children: ReactNode;
  testId?: string;
}) {
  const off = loading || disabled;
  return (
    <button
      type="submit"
      disabled={off}
      data-testid={testId}
      className={`flex w-full items-center justify-center rounded-lg py-2.5 text-sm font-semibold text-white transition-colors duration-300 ${
        loading
          ? "cursor-not-allowed bg-gray-600"
          : disabled
            ? "cursor-not-allowed bg-gray-400"
            : "bg-primary hover:bg-[#14365d]"
      }`}
    >
      {loading ? <Loader2 size={24} className="animate-spin" /> : children}
    </button>
  );
}

/* ---------- BizTrack ModalFooter: Powered by + logo ---------- */

export function AuthFooter() {
  return (
    <div className="flex items-center justify-center space-x-2 bg-white py-2">
      <span className="text-sm leading-none text-gray-700">Powered by</span>
      <img src="/logo-icon.svg" alt="BCC logo" className="h-5 align-middle object-contain" />
    </div>
  );
}

export default AuthShell;

import { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

export default function PasswordInput({ value, onChange, className = "", ...rest }: Props) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <input type={show ? "text" : "password"} value={value} onChange={onChange} {...rest} className={`${className} pr-10`} />

      <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        {show ? <LuEyeOff className="h-5 w-5" /> : <LuEye className="h-5 w-5" />}
      </button>
    </div>
  );
}

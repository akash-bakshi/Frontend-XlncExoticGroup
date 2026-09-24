import type { ReactNode } from "react";

export type Message = { text: string; ok: boolean } | null;

export const ok = (text: string): Message => ({ text, ok: true });
export const bad = (text: string): Message => ({ text, ok: false });

interface StatusMessageProps {
  message: Message;
  id?: string;
  live?: boolean;
}

export function StatusMessage({ message, id, live = true }: StatusMessageProps) {
  const className = message ? `p-msg ${message.ok ? "p-msg-ok" : "p-msg-bad"}` : "p-msg";
  return (
    <p className={className} id={id} {...(live && { role: "status", "aria-live": "polite" as const })}>
      {message?.text}
    </p>
  );
}

export const Hint = ({ children }: { children: ReactNode }) => <span className="p-hint">{children}</span>;

export const Tag = ({ children, none = false, title }: { children: ReactNode; none?: boolean; title?: string }) => (
  <span className={none ? "p-tag p-tag-none" : "p-tag"} title={title}>
    {children}
  </span>
);

interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
  className?: string;
  autoFocus?: boolean;
}

export const Button = ({ children, onClick, className = "p-btn p-btn-ghost p-btn-sm", autoFocus }: ButtonProps) => (
  <button type="button" className={className} onClick={onClick} autoFocus={autoFocus}>
    {children}
  </button>
);

export const plural = (n: number, word: string) => (n === 1 ? word : `${word}s`);

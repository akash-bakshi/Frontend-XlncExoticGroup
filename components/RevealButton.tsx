interface RevealButtonProps {
  className: string;
  controls: string;
  visible: boolean;
  onToggle: () => void;
  id?: string;
}

export function RevealButton({ className, controls, visible, onToggle, id }: RevealButtonProps) {
  return (
    <button
      type="button"
      className={className}
      id={id}
      aria-pressed={visible}
      aria-controls={controls}
      onClick={onToggle}
    >
      {visible ? "Hide" : "Show"}
    </button>
  );
}

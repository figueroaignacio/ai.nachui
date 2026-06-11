interface ChatInputProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: (v: string) => void;
  disabled?: boolean;
}

export function ChatInput({ value, onChange, onSubmit, disabled }: ChatInputProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(value);
      }}
      className="group border-border/50 bg-card/50 text-muted-foreground hover:border-muted-foreground/20 flex w-full items-center gap-3 rounded-lg border px-4 py-2.5 text-left transition-colors duration-150"
    >
      <input
        type="text"
        placeholder={disabled ? 'Thinking…' : 'Send a message...'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="text-foreground placeholder:text-muted-foreground/60 flex-1 bg-transparent text-xs outline-none disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className="bg-muted hover:bg-primary hover:text-primary-foreground flex size-6 shrink-0 items-center justify-center rounded transition-colors duration-150 disabled:opacity-40"
      >
        {disabled ? (
          <span className="block size-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <span className="text-[10px]">↑</span>
        )}
      </button>
    </form>
  );
}

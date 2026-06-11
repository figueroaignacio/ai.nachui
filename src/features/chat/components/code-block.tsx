import { CheckIcon, Copy01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import * as React from 'react';

interface CodeBlockProps {
  language: string;
  code: string;
}

export function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code', err);
    }
  };

  return (
    <div className="border-border/30 my-4 overflow-hidden rounded-lg border bg-zinc-950/90 font-mono text-xs text-zinc-100 shadow-md">
      <div className="border-border/20 flex items-center justify-between border-b bg-zinc-950 px-4 py-1.5 text-[10px] font-semibold text-zinc-400 select-none">
        <span>{language.toLowerCase()}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded px-2 py-1 transition-colors duration-150 hover:bg-zinc-800 hover:text-zinc-100"
        >
          <HugeiconsIcon icon={copied ? CheckIcon : Copy01Icon} className="size-3" size={12} />
          {copied ? 'Copied' : 'Copy code'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono leading-relaxed text-zinc-100 select-text">
        <code>{code.trim()}</code>
      </pre>
    </div>
  );
}

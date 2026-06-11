import {
  CheckIcon,
  Copy01Icon,
  Refresh01Icon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import * as React from 'react';
import { AiAvatar } from '@/shared/components/ai-avatar';
import { MarkdownRenderer } from './markdown-renderer';

// ---------------------------------------------------------------------------
// 1. Message Item Component
// ---------------------------------------------------------------------------

interface MessageItemProps {
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
  onRegenerate?: () => void;
}

export function MessageItem({
  role,
  content,
  isStreaming = false,
  onRegenerate,
}: MessageItemProps) {
  const [copied, setCopied] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'up' | 'down' | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy message', err);
    }
  };

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback((prev) => (prev === type ? null : type));
  };

  if (role === 'user') {
    return (
      <div className="group/msg flex w-full justify-end py-2 select-text">
        <div className="bg-secondary/70 border-border/40 text-foreground max-w-[80%] rounded-2xl border px-4 py-2.5 text-xs leading-relaxed shadow-sm md:text-sm">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="group/msg border-border/10 flex w-full gap-4 border-b py-6 select-text last:border-b-0">
      {/* AI Assistant Avatar */}

      <AiAvatar size="lg" />

      {/* Content & Actions */}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <span className="text-foreground/80 text-xs font-semibold">NachAI</span>
          {isStreaming && (
            <span className="bg-muted text-muted-foreground/60 animate-pulse rounded px-1.5 py-0.5 text-[9px] font-medium tracking-wide uppercase">
              Generating
            </span>
          )}
        </div>

        {/* Text Container */}
        <div className="text-foreground/90 pr-4 leading-relaxed">
          <MarkdownRenderer content={content} />
          {isStreaming && (
            <span className="bg-primary/80 ml-1 inline-block h-3.5 w-1 animate-pulse rounded-sm align-middle" />
          )}
        </div>

        {/* Action Buttons */}
        {!isStreaming && content && (
          <div className="mt-2.5 flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover/msg:opacity-100 focus-within:opacity-100">
            <button
              onClick={handleCopy}
              className="text-muted-foreground/50 hover:text-foreground hover:bg-muted flex h-6 w-6 items-center justify-center rounded transition-colors duration-150"
              title="Copy message"
            >
              <HugeiconsIcon
                icon={copied ? CheckIcon : Copy01Icon}
                className="size-3.5"
                size={14}
              />
            </button>
            <button
              onClick={() => handleFeedback('up')}
              className={`flex h-6 w-6 items-center justify-center rounded transition-colors duration-150 ${
                feedback === 'up'
                  ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                  : 'text-muted-foreground/50 hover:text-foreground hover:bg-muted'
              }`}
              title="Helpful"
            >
              <HugeiconsIcon icon={ThumbsUpIcon} className="size-3.5" size={14} />
            </button>
            <button
              onClick={() => handleFeedback('down')}
              className={`flex h-6 w-6 items-center justify-center rounded transition-colors duration-150 ${
                feedback === 'down'
                  ? 'bg-red-500/10 text-red-600 dark:text-red-400'
                  : 'text-muted-foreground/50 hover:text-foreground hover:bg-muted'
              }`}
              title="Not helpful"
            >
              <HugeiconsIcon icon={ThumbsDownIcon} className="size-3.5" size={14} />
            </button>
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="text-muted-foreground/50 hover:text-foreground hover:bg-muted flex h-6 w-6 items-center justify-center rounded transition-colors duration-150"
                title="Regenerate response"
              >
                <HugeiconsIcon icon={Refresh01Icon} className="size-3.5" size={14} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

import {
  CheckIcon,
  Copy01Icon,
  Refresh01Icon,
  ThumbsDownIcon,
  ThumbsUpIcon,
} from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import * as React from 'react';
import { AiAvatar } from '../../../shared/components/ai-avatar';

// ---------------------------------------------------------------------------
// 1. Code Block Component
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// 2. Markdown Renderer Component
// ---------------------------------------------------------------------------

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Parse inline styles: bold (**), italic (*), inline code (`)
  const renderInlineText = (text: string): React.ReactNode[] => {
    const tokens = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return tokens.map((token, i) => {
      if (token.startsWith('`') && token.endsWith('`')) {
        return (
          <code
            key={i}
            className="bg-muted/80 border-border/40 rounded border px-1 py-0.5 font-mono text-[11px] font-medium break-all text-pink-600 dark:text-pink-400"
          >
            {token.slice(1, -1)}
          </code>
        );
      }
      if (token.startsWith('**') && token.endsWith('**')) {
        return (
          <strong key={i} className="text-foreground font-semibold">
            {token.slice(2, -2)}
          </strong>
        );
      }
      if (token.startsWith('*') && token.endsWith('*')) {
        return (
          <em key={i} className="italic">
            {token.slice(1, -1)}
          </em>
        );
      }
      return token;
    });
  };

  // Split content by code blocks: ```lang\ncode\n```
  const parts = content.split(/```/);
  const elements: React.ReactNode[] = [];

  parts.forEach((part, index) => {
    // Odd indexes are code blocks
    if (index % 2 === 1) {
      const match = part.match(/^([a-zA-Z0-9+#-]+)?\n([\s\S]*)$/);
      const lang = match ? match[1] || 'code' : 'code';
      const code = match ? match[2] : part;
      elements.push(<CodeBlock key={`code-${index}`} language={lang} code={code} />);
    } else {
      // Even indexes are regular markdown text blocks
      const lines = part.split('\n');
      let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;

      const flushList = (key: string | number) => {
        if (!currentList) return;
        const ListTag = currentList.type;
        elements.push(
          <ListTag
            key={`list-${key}`}
            className={
              currentList.type === 'ul'
                ? 'text-foreground/90 my-3 list-disc space-y-1 pl-5 text-xs md:text-sm'
                : 'text-foreground/90 my-3 list-decimal space-y-1 pl-5 text-xs md:text-sm'
            }
          >
            {currentList.items.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {renderInlineText(item)}
              </li>
            ))}
          </ListTag>,
        );
        currentList = null;
      };

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.startsWith('### ')) {
          flushList(i);
          elements.push(
            <h3 key={i} className="text-foreground mt-4 mb-2 text-sm font-semibold first:mt-0">
              {renderInlineText(line.slice(4))}
            </h3>,
          );
        } else if (line.startsWith('## ')) {
          flushList(i);
          elements.push(
            <h2 key={i} className="text-foreground mt-5 mb-2 text-base font-semibold first:mt-0">
              {renderInlineText(line.slice(3))}
            </h2>,
          );
        } else if (line.startsWith('# ')) {
          flushList(i);
          elements.push(
            <h1 key={i} className="text-foreground mt-6 mb-3 text-lg font-bold first:mt-0">
              {renderInlineText(line.slice(2))}
            </h1>,
          );
        } else if (line.startsWith('- ') || line.startsWith('* ')) {
          const content = line.slice(2);
          if (currentList && currentList.type === 'ul') {
            currentList.items.push(content);
          } else {
            flushList(i);
            currentList = { type: 'ul', items: [content] };
          }
        } else if (/^\d+\.\s/.test(line)) {
          const match = line.match(/^(\d+)\.\s(.*)$/);
          const content = match ? match[2] : line;
          if (currentList && currentList.type === 'ol') {
            currentList.items.push(content);
          } else {
            flushList(i);
            currentList = { type: 'ol', items: [content] };
          }
        } else if (line.startsWith('> ')) {
          flushList(i);
          elements.push(
            <blockquote
              key={i}
              className="border-l-primary/30 text-muted-foreground my-3 border-l-2 pl-4 italic"
            >
              {renderInlineText(line.slice(2))}
            </blockquote>,
          );
        } else if (!line.trim()) {
          flushList(i);
        } else {
          flushList(i);
          elements.push(
            <p
              key={i}
              className="text-foreground/90 my-2 text-xs leading-relaxed last:mb-0 md:text-sm"
            >
              {renderInlineText(line)}
            </p>,
          );
        }
      }
      flushList(`final-${index}`);
    }
  });

  return <div className="space-y-1.5">{elements}</div>;
}

// ---------------------------------------------------------------------------
// 3. Message Item Component
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

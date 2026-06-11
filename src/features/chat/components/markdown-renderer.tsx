import * as React from 'react';
import ReactMarkdown from 'react-markdown';
import { CodeBlock } from './code-block';

interface ToolCallBadgeProps {
  name: string;
  argsString: string;
}

export function ToolCallBadge({ name, argsString }: ToolCallBadgeProps) {
  const [open, setOpen] = React.useState(false);
  const parsedArgs = React.useMemo(() => {
    try {
      return JSON.parse(argsString);
    } catch {
      return argsString;
    }
  }, [argsString]);

  return (
    <div className="border-border/40 my-3 overflow-hidden rounded-xl border bg-zinc-900/40 shadow-xs backdrop-blur-xs transition-all duration-200">
      <div className="flex items-center justify-between bg-zinc-900/30 px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2 w-2">
            <span className="bg-primary/60 absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"></span>
            <span className="bg-primary relative inline-flex h-2 w-2 rounded-full"></span>
          </span>
          <span className="text-foreground/80 font-mono text-xs font-semibold tracking-wide">
            {name}
          </span>
          <span className="text-muted-foreground/60 bg-muted/50 border-border/30 rounded-full border px-2 py-0.5 text-[10px] font-medium">
            tool call
          </span>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1 text-[11px] font-medium transition-colors select-none"
        >
          <span className="font-mono">{open ? 'Hide details' : 'Show details'}</span>
          <svg
            className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      {open && (
        <div className="border-border/20 max-h-60 overflow-x-auto border-t bg-zinc-950/80 p-3 font-mono text-[11px] text-zinc-300">
          <pre className="leading-relaxed">
            {typeof parsedArgs === 'object' ? JSON.stringify(parsedArgs, null, 2) : parsedArgs}
          </pre>
        </div>
      )}
    </div>
  );
}

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      components={{
        code(props) {
          const { children, className, ...rest } = props;
          const match = /language-(\w+)/.exec(className || '');
          const isInline = !match;

          if (isInline) {
            return (
              <code
                className="bg-muted/80 border-border/40 rounded border px-1 py-0.5 font-mono text-[11px] font-medium break-all text-pink-600 dark:text-pink-400"
                {...rest}
              >
                {children}
              </code>
            );
          }

          return <CodeBlock language={match[1]} code={String(children).replace(/\n$/, '')} />;
        },

        em(props) {
          const { children } = props;
          const text = React.Children.toArray(children).join('').trim();
          if (text.startsWith('[Calling tool ') && text.endsWith('...]')) {
            const toolMatch = text.match(/^\[Calling tool '([^']+)' with args (.*?)\.\.\.\]$/);
            if (toolMatch) {
              return <ToolCallBadge name={toolMatch[1]} argsString={toolMatch[2]} />;
            }
          }
          return <em className="italic">{children}</em>;
        },

        p(props) {
          return (
            <p className="text-foreground/90 my-2 text-xs leading-relaxed last:mb-0 md:text-sm">
              {props.children}
            </p>
          );
        },
        h1(props) {
          return (
            <h1 className="text-foreground mt-6 mb-3 text-lg font-bold first:mt-0">
              {props.children}
            </h1>
          );
        },
        h2(props) {
          return (
            <h2 className="text-foreground mt-5 mb-2 text-base font-semibold first:mt-0">
              {props.children}
            </h2>
          );
        },
        h3(props) {
          return (
            <h3 className="text-foreground mt-4 mb-2 text-sm font-semibold first:mt-0">
              {props.children}
            </h3>
          );
        },
        ul(props) {
          return (
            <ul className="text-foreground/90 my-3 list-disc space-y-1 pl-5 text-xs md:text-sm">
              {props.children}
            </ul>
          );
        },
        ol(props) {
          return (
            <ol className="text-foreground/90 my-3 list-decimal space-y-1 pl-5 text-xs md:text-sm">
              {props.children}
            </ol>
          );
        },
        li(props) {
          return <li className="leading-relaxed">{props.children}</li>;
        },
        blockquote(props) {
          return (
            <blockquote className="border-l-primary/30 text-muted-foreground my-3 border-l-2 pl-4 italic">
              {props.children}
            </blockquote>
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

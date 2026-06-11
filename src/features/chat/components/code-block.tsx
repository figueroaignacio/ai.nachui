import { CheckIcon, Copy01Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import * as React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

const githubDark = {
  'code[class*="language-"]': {
    color: '#e6edf3',
    background: 'none',
    fontFamily:
      '"Geist Mono", "Fira Code", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
    fontSize: '0.78rem',
    lineHeight: '1.7',
    direction: 'ltr' as const,
    textAlign: 'left' as const,
    whiteSpace: 'pre' as const,
    wordSpacing: 'normal',
    wordBreak: 'normal' as const,
    tabSize: 2,
    hyphens: 'none' as const,
  },
  'pre[class*="language-"]': {
    color: '#e6edf3',
    background: '#0d1117',
    fontFamily:
      '"Geist Mono", "Fira Code", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
    fontSize: '0.78rem',
    lineHeight: '1.7',
    direction: 'ltr' as const,
    textAlign: 'left' as const,
    whiteSpace: 'pre' as const,
    wordSpacing: 'normal',
    wordBreak: 'normal' as const,
    tabSize: 2,
    hyphens: 'none' as const,
    padding: '1.25rem 1.5rem',
    margin: 0,
    overflow: 'auto',
    borderRadius: 0,
  },
  comment: { color: '#8b949e', fontStyle: 'italic' as const },
  prolog: { color: '#8b949e' },
  doctype: { color: '#8b949e' },
  cdata: { color: '#8b949e' },
  punctuation: { color: '#e6edf3' },
  namespace: { opacity: 0.7 },
  property: { color: '#79c0ff' },
  tag: { color: '#7ee787' },
  boolean: { color: '#79c0ff' },
  number: { color: '#79c0ff' },
  constant: { color: '#79c0ff' },
  symbol: { color: '#79c0ff' },
  deleted: { color: '#ffa198' },
  selector: { color: '#7ee787' },
  'attr-name': { color: '#79c0ff' },
  string: { color: '#a5d6ff' },
  char: { color: '#a5d6ff' },
  builtin: { color: '#7ee787' },
  inserted: { color: '#7ee787' },
  operator: { color: '#ff7b72' },
  entity: { color: '#d2a8ff', cursor: 'help' },
  url: { color: '#a5d6ff' },
  variable: { color: '#ffa657' },
  atrule: { color: '#d2a8ff' },
  'attr-value': { color: '#a5d6ff' },
  function: { color: '#d2a8ff' },
  'class-name': { color: '#ffa657' },
  keyword: { color: '#ff7b72' },
  regex: { color: '#a5d6ff' },
  important: { color: '#ff7b72', fontWeight: 'bold' as const },
  bold: { fontWeight: 'bold' as const },
  italic: { fontStyle: 'italic' as const },
};

interface CodeBlockProps {
  language: string;
  code: string;
}

export function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);

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
    <div
      className="group relative my-4 overflow-hidden rounded-xl shadow-lg"
      style={{
        background: '#0d1117',
        border: '1px solid #21262d',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="absolute top-3 right-3 z-10 transition-all duration-200"
        style={{
          opacity: hovered ? 1 : 0,
          transform: hovered ? 'translateY(0)' : 'translateY(-4px)',
        }}
      >
        <button
          onClick={handleCopy}
          className="flex cursor-pointer items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-medium backdrop-blur-sm transition-all duration-150"
          style={{
            background: copied ? 'rgba(46,160,67,0.2)' : 'rgba(33,38,45,0.9)',
            border: `1px solid ${copied ? '#2ea043' : '#30363d'}`,
            color: copied ? '#7ee787' : '#8b949e',
          }}
        >
          <HugeiconsIcon icon={copied ? CheckIcon : Copy01Icon} className="size-3" size={12} />
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <SyntaxHighlighter
        language={language || 'text'}
        style={githubDark}
        customStyle={{
          margin: 0,
          background: '#0d1117',
          borderRadius: 0,
        }}
        showLineNumbers
        lineNumberStyle={{
          minWidth: '2.5em',
          paddingRight: '1.25em',
          color: '#3d444d',
          userSelect: 'none',
          textAlign: 'right',
          fontFamily: '"Geist Mono", ui-monospace, Menlo, Consolas, monospace',
          fontSize: '0.75rem',
        }}
        wrapLongLines={false}
      >
        {code.trim()}
      </SyntaxHighlighter>
    </div>
  );
}

import * as React from 'react';
import { CodeBlock } from './code-block';

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

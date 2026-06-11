import { type MessageRead } from '@/features/chat/api/chat-api';
import { MessageItem } from './message-item';

interface MessageListProps {
  messages: MessageRead[];
  streamingContent: string;
  isStreaming: boolean;
  onRegenerate?: () => void;
}

export function MessageList({ messages, streamingContent, isStreaming, onRegenerate }: MessageListProps) {
  return (
    <div className="flex flex-col gap-2">
      {messages.map((msg, idx) => {
        const isLast = idx === messages.length - 1;
        return (
          <MessageItem
            key={msg.id}
            role={msg.role}
            content={msg.content}
            onRegenerate={isLast && msg.role === 'assistant' ? onRegenerate : undefined}
          />
        );
      })}
      {(isStreaming || streamingContent) && (
        <MessageItem role="assistant" content={streamingContent} isStreaming={true} />
      )}
    </div>
  );
}

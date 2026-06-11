/**
 * useStreamingMessage – consumes an SSE ReadableStream body and accumulates
 * assistant content incrementally.
 *
 * Usage:
 *   const { content, isStreaming, start, reset } = useStreamingMessage();
 *   await start(responseBodyStream);
 */
import * as React from 'react';

interface StreamingState {
  content: string;
  isStreaming: boolean;
  error: string | null;
}

interface StreamingActions {
  start: (stream: ReadableStream<Uint8Array>) => Promise<void>;
  reset: () => void;
}

export function useStreamingMessage(): StreamingState & StreamingActions {
  const [state, setState] = React.useState<StreamingState>({
    content: '',
    isStreaming: false,
    error: null,
  });

  const reset = React.useCallback(() => {
    setState({ content: '', isStreaming: false, error: null });
  }, []);

  const start = React.useCallback(async (stream: ReadableStream<Uint8Array>) => {
    setState({ content: '', isStreaming: true, error: null });

    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // SSE lines end with \n\n — split and process each complete event
        const lines = buffer.split('\n\n');
        buffer = lines.pop() ?? ''; // keep incomplete last chunk

        for (const line of lines) {
          const dataLine = line.trim();
          if (!dataLine.startsWith('data:')) continue;

          const json = dataLine.slice('data:'.length).trim();
          try {
            const parsed = JSON.parse(json) as { content: string; done: boolean };
            if (parsed.content) {
              setState((prev) => ({
                ...prev,
                content: prev.content + parsed.content,
              }));
            }
            if (parsed.done) {
              setState((prev) => ({ ...prev, isStreaming: false }));
              return;
            }
          } catch {
            // Malformed JSON — skip silently
          }
        }
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Streaming error';
      setState((prev) => ({
        ...prev,
        isStreaming: false,
        error: errMsg,
      }));
      throw new Error(errMsg, { cause: err });
    } finally {
      setState((prev) => ({ ...prev, isStreaming: false }));
      reader.releaseLock();
    }
  }, []);

  return { ...state, start, reset };
}

import { Menu01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import * as React from 'react'
import { SuggestionCard } from '../../../shared/components/ui/navigation'
import { Sidebar } from '../../../shared/components/ui/sidebar'
import { Typography } from '../../../shared/components/ui/typography'
import { useRequireAuth } from '../../auth/hooks/use-require-auth'

export function ChatNewPage() {
  const { user } = useRequireAuth()
  const [activeItem, setActiveItem] = React.useState('new-chat')
  const [messages, setMessages] = React.useState<
    Array<{ role: 'user' | 'assistant'; text: string }>
  >([])
  const [inputValue, setInputValue] = React.useState('')

  const suggestions = [
    { title: 'Analyze UI component' },
    { title: 'Refactor Tailwind styles' },
    { title: 'Optimize state flow' },
    { title: 'Explain system design' },
  ]

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return
    setMessages((prev) => [...prev, { role: 'user', text }])
    setInputValue('')
    // Simulate assistant reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: `You asked about: "${text}". How else can I help?`,
        },
      ])
    }, 600)
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar Component */}
      <Sidebar
        activeItem={activeItem}
        onNewChat={() => {
          setActiveItem('new-chat')
          setMessages([])
        }}
        onDocsClick={() => setActiveItem('docs')}
        onSettingsClick={() => setActiveItem('settings')}
        onChatClick={(chatName) => {
          setActiveItem(chatName)
          setMessages([{ role: 'user', text: chatName }])
        }}
      />

      {/* Main Content Area */}
      <div className="relative flex flex-1 flex-col overflow-y-auto">
        <header className="flex h-14 items-center justify-between border-b border-border/60 px-4 md:hidden">
          <button
            type="button"
            className="flex size-8 items-center justify-center text-muted-foreground">
            <HugeiconsIcon icon={Menu01Icon} className="size-5" size={20} />
          </button>
          <span className="text-sm font-semibold">NachAI</span>
          <div className="size-8" />
        </header>

        {messages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
            <div className="flex w-full max-w-xl flex-col items-center gap-6">
              <div className="flex flex-col items-center gap-2">
                {user && (
                  <pre className="text-[10px] font-mono text-muted-foreground bg-muted/40 border border-border/40 p-2 rounded max-w-full overflow-x-auto select-all">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                )}
                <Typography
                  variant="h3"
                  align="center"
                  className="text-foreground text-xl font-medium tracking-tight">
                  What can I help with?
                </Typography>
              </div>

              {/* Chat Input form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleSendMessage(inputValue)
                }}
                className="group flex w-full items-center gap-3 rounded-lg border border-border/50 bg-card/50 px-4 py-2.5 text-left text-muted-foreground transition-colors duration-150 hover:border-muted-foreground/20">
                <input
                  type="text"
                  placeholder="Send a message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground/60"
                />
                <button
                  type="submit"
                  className="flex size-6 shrink-0 items-center justify-center rounded bg-muted hover:bg-primary hover:text-primary-foreground transition-colors duration-150">
                  <span className="text-[10px]">↑</span>
                </button>
              </form>

              {/* Suggestions Grid */}
              <div className="flex max-w-2xl flex-wrap justify-center gap-2">
                {suggestions.map((s, idx) => (
                  <SuggestionCard
                    key={idx}
                    title={s.title}
                    onClick={() => handleSendMessage(s.title)}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Conversation Flow style */
          <div className="flex flex-1 flex-col justify-between px-6 py-6 max-w-2xl mx-auto w-full">
            <div className="space-y-4 overflow-y-auto mb-6">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`rounded-lg px-3 py-2 text-xs max-w-[85%] border ${
                      msg.role === 'user'
                        ? 'bg-secondary text-secondary-foreground border-border/50'
                        : 'bg-card text-foreground border-border/30'
                    }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Form at bottom */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage(inputValue)
              }}
              className="group flex w-full items-center gap-3 rounded-lg border border-border/50 bg-card/50 px-4 py-2.5 text-left text-muted-foreground transition-colors duration-150 hover:border-muted-foreground/20">
              <input
                type="text"
                placeholder="Send a message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground/60"
              />
              <button
                type="submit"
                className="flex size-6 shrink-0 items-center justify-center rounded bg-muted hover:bg-primary hover:text-primary-foreground transition-colors duration-150">
                <span className="text-[10px]">↑</span>
              </button>
            </form>
          </div>
        )}

        <footer className="flex justify-center py-4">
          <Typography
            variant="muted"
            className="text-[10px] text-muted-foreground/40">
            Powered by{' '}
            <a
              href="https://nachui.tech"
              className="font-medium underline underline-offset-4 hover:text-foreground">
              nachui.tech
            </a>
          </Typography>
        </footer>
      </div>
    </div>
  )
}

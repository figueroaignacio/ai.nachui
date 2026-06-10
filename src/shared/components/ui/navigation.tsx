import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'

interface SuggestionCardProps {
  title: string
  onClick?: () => void
}

export function SuggestionCard({ title, onClick }: SuggestionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex cursor-pointer flex-col gap-1 rounded-lg border border-border/40 bg-card/40 p-3 text-left transition-colors duration-150 hover:border-muted-foreground/20 hover:bg-muted/25">
      <span className="text-xs font-medium text-foreground">{title}</span>
    </button>
  )
}

interface SidebarItemProps {
  icon?: IconSvgElement
  label: string
  active?: boolean
  onClick?: () => void
}

export function SidebarItem({
  icon,
  label,
  active = false,
  onClick,
}: SidebarItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-150 ${
        active
          ? 'bg-secondary text-secondary-foreground font-medium'
          : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
      }`}>
      {icon && (
        <HugeiconsIcon icon={icon} className="size-4 shrink-0" size={16} />
      )}
      <span className="truncate">{label}</span>
    </button>
  )
}

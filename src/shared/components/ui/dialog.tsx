'use client'

import { Cancel01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { AnimatePresence, type HTMLMotionProps, motion } from 'motion/react'
import * as React from 'react'
import { cloneElement } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '../../lib/cn'

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

// --- Animation constants (module level) ---

const OVERLAY_VARIANTS = {
  initial: { opacity: 0, backdropFilter: 'blur(0px)' },
  animate: { opacity: 1, backdropFilter: 'blur(4px)' },
  exit: { opacity: 0, backdropFilter: 'blur(0px)' },
} as const

const OVERLAY_TRANSITION = { duration: 0.3 } as const
const OVERLAY_STYLE = { willChange: 'opacity' } as const

const DIALOG_VARIANTS = {
  initial: { opacity: 0, scale: 0.9, filter: 'blur(10px)', y: 10 },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 },
  exit: { opacity: 0, scale: 0.9, filter: 'blur(10px)', y: 10 },
} as const

const DIALOG_TRANSITION = {
  type: 'spring',
  damping: 25,
  stiffness: 350,
  mass: 0.5,
} as const

const DIALOG_EXIT_TRANSITION = { duration: 0.2, ease: 'easeIn' } as const
const DIALOG_STYLE = { willChange: 'opacity, transform, filter' } as const

// --- Context ---

type DialogContextType = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  id: string
}

const DialogContext = React.createContext<DialogContextType | undefined>(
  undefined,
)

const useDialogContext = () => {
  const context = React.use(DialogContext)
  if (!context) {
    throw new Error('useDialogContext must be used within a Dialog')
  }
  return context
}

// --- Components ---

interface DialogProps {
  children: React.ReactNode
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const DialogRoot = ({
  children,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
}: DialogProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const id = React.useId()

  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen

  const setOpen = React.useCallback(
    (value: boolean | ((prev: boolean) => boolean)) => {
      if (!isControlled) {
        setUncontrolledOpen(value)
      }

      if (onOpenChange) {
        const newValue = typeof value === 'function' ? value(open) : value
        onOpenChange(newValue)
      }
    },
    [isControlled, onOpenChange, open],
  )

  return <DialogContext value={{ open, setOpen, id }}>{children}</DialogContext>
}

interface DialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const DialogTrigger = ({
  asChild,
  onClick,
  ref,
  ...props
}: DialogTriggerProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const { setOpen } = useDialogContext()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(true)
    onClick?.(e)
  }

  if (asChild) {
    return cloneElement(
      props.children as React.ReactElement<Record<string, unknown>>,
      {
        onClick: handleClick,
      },
    )
  }

  return <button type="button" onClick={handleClick} ref={ref} {...props} />
}
DialogTrigger.displayName = 'DialogTrigger'

interface DialogPortalProps {
  children: React.ReactNode
}

const DialogPortal = ({ children }: DialogPortalProps) => {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return createPortal(children, document.body)
}

interface DialogCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

const DialogClose = ({
  asChild,
  onClick,
  ref,
  ...props
}: DialogCloseProps & { ref?: React.Ref<HTMLButtonElement> }) => {
  const { setOpen } = useDialogContext()

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpen(false)
    onClick?.(e)
  }

  if (asChild) {
    return cloneElement(
      props.children as React.ReactElement<Record<string, unknown>>,
      {
        onClick: handleClick,
      },
    )
  }

  return <button type="button" onClick={handleClick} ref={ref} {...props} />
}
DialogClose.displayName = 'DialogClose'

type DialogOverlayProps = HTMLMotionProps<'div'> & {
  className?: string
}

const DialogOverlay = ({
  className,
  ref,
  ...props
}: DialogOverlayProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { setOpen } = useDialogContext()

  return (
    <motion.div
      ref={ref}
      variants={OVERLAY_VARIANTS}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={OVERLAY_TRANSITION}
      style={OVERLAY_STYLE}
      className={cn('fixed inset-0 z-200 bg-black/10', className)}
      onClick={() => setOpen(false)}
      {...props}
    />
  )
}
DialogOverlay.displayName = 'DialogOverlay'

type DialogContentProps = {
  className?: string
  children?: React.ReactNode
}

const DialogContent = ({
  className,
  children,
  ref,
}: DialogContentProps & { ref?: React.Ref<HTMLDivElement> }) => {
  const { id, open, setOpen } = useDialogContext()
  const contentRef = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLElement | null>(null)

  React.useEffect(() => {
    if (!open) return

    triggerRef.current = document.activeElement as HTMLElement

    const trapFocus = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      const content = contentRef.current
      if (!content) return

      const focusable = Array.from(
        content.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      )
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('keydown', trapFocus)
    document.addEventListener('keydown', handleEscape)

    requestAnimationFrame(() => {
      const content = contentRef.current
      if (content) {
        const focusable = content.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
        focusable?.focus()
      }
    })

    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', trapFocus)
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
      triggerRef.current?.focus()
    }
  }, [open, setOpen])

  return (
    <AnimatePresence mode="wait">
      {open && (
        <DialogPortal>
          <DialogOverlay />
          <motion.div
            ref={(node) => {
              contentRef.current = node
              if (typeof ref === 'function') ref(node)
              else if (ref)
                (ref as React.MutableRefObject<HTMLDivElement | null>).current =
                  node
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={`${id}-title`}
            aria-describedby={`${id}-description`}
            onClick={(e) => e.stopPropagation()}
            variants={DIALOG_VARIANTS}
            initial="initial"
            animate="animate"
            exit={{
              ...DIALOG_VARIANTS.exit,
              transition: DIALOG_EXIT_TRANSITION,
            }}
            transition={DIALOG_TRANSITION}
            style={DIALOG_STYLE}
            className={cn(
              'bg-background fixed border-border border top-[50%] left-[50%] z-500 grid w-full max-w-xl translate-x-[-50%] translate-y-[-50%] gap-4 rounded-xl border-border p-6',
              className,
            )}>
            {children}
            <DialogClose className="ring-offset-background focus-visible:ring-ring absolute top-4 right-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none">
              <HugeiconsIcon
                icon={Cancel01Icon}
                className="h-4 w-4"
                size={16}
              />
              <span className="sr-only">Close</span>
            </DialogClose>
          </motion.div>
        </DialogPortal>
      )}
    </AnimatePresence>
  )
}
DialogContent.displayName = 'DialogContent'

type DialogHeaderProps = React.HTMLAttributes<HTMLDivElement>

const DialogHeader = ({ className, ...props }: DialogHeaderProps) => {
  return (
    <div
      className={cn(
        'flex flex-col space-y-1.5 text-center sm:text-left',
        className,
      )}
      {...props}
    />
  )
}
DialogHeader.displayName = 'DialogHeader'

type DialogFooterProps = React.HTMLAttributes<HTMLDivElement>

const DialogFooter = ({ className, ...props }: DialogFooterProps) => {
  return (
    <div
      className={cn(
        'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
        className,
      )}
      {...props}
    />
  )
}
DialogFooter.displayName = 'DialogFooter'

type DialogTitleProps = React.HTMLAttributes<HTMLHeadingElement>

const DialogTitle = ({
  className,
  children,
  ref,
  ...props
}: DialogTitleProps & { ref?: React.Ref<HTMLHeadingElement> }) => {
  const { id } = useDialogContext()

  return (
    <h2
      id={`${id}-title`}
      ref={ref}
      className={cn(
        'text-lg leading-none font-semibold tracking-tight',
        className,
      )}
      {...props}>
      {children}
    </h2>
  )
}
DialogTitle.displayName = 'DialogTitle'

type DialogDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>

const DialogDescription = ({
  className,
  ref,
  ...props
}: DialogDescriptionProps & { ref?: React.Ref<HTMLParagraphElement> }) => {
  const { id } = useDialogContext()

  return (
    <p
      id={`${id}-description`}
      ref={ref}
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  )
}
DialogDescription.displayName = 'DialogDescription'

const Dialog = Object.assign(DialogRoot, {
  Trigger: DialogTrigger,
  Portal: DialogPortal,
  Overlay: DialogOverlay,
  Close: DialogClose,
  Content: DialogContent,
  Header: DialogHeader,
  Footer: DialogFooter,
  Title: DialogTitle,
  Description: DialogDescription,
})

export { Dialog }

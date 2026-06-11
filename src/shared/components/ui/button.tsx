'use client';

import { Loading02Icon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { cva, type VariantProps } from 'class-variance-authority';
import { AnimatePresence, type HTMLMotionProps, motion, useReducedMotion } from 'motion/react';
import React from 'react';
import { cn } from '@/shared/lib/cn';

// --- CVA ---

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium outline-none select-none relative overflow-hidden disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed aria-invalid:ring-2 aria-invalid:ring-destructive/50 aria-invalid:border-destructive',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground',
        destructive: 'bg-destructive text-destructive-foreground',
        outline: 'border-border border bg-background hover:bg-muted',
        secondary: 'bg-secondary text-secondary-foreground',
        ghost: 'hover:bg-muted',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3 text-xs',
        lg: 'h-11 px-8 text-base',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

// --- Animation variants (hoisted at module level) ---

const LOADER_VARIANTS = {
  initial: { opacity: 0, scale: 0.8, filter: 'blur(4px)' },
  animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, scale: 0.8, filter: 'blur(4px)' },
} as const;

const CONTENT_VARIANTS = {
  initial: { opacity: 0, y: 5, filter: 'blur(4px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -5, filter: 'blur(4px)' },
} as const;

const SWAP_TRANSITION = { duration: 0.2 } as const;
const BUTTON_SPRING = { type: 'spring', stiffness: 400, damping: 17 } as const;
const BUTTON_STYLE = { willChange: 'transform' } as const;

// --- Component ---

interface ButtonProps extends HTMLMotionProps<'button'>, VariantProps<typeof buttonVariants> {
  loading?: boolean;
  loader?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  asChild?: boolean;
  children?: React.ReactNode;
}

const ButtonRoot = ({
  className,
  variant = 'default',
  size = 'default',
  loading = false,
  loader,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  children,
  type = 'button',
  ref,
  ...props
}: ButtonProps) => {
  const isDisabled = disabled || loading;
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.button
      ref={ref}
      type={type}
      disabled={isDisabled}
      aria-busy={loading}
      className={cn(buttonVariants({ variant, size }), fullWidth && 'w-full', className)}
      whileTap={!isDisabled && !shouldReduceMotion ? { scale: 0.96 } : undefined}
      transition={BUTTON_SPRING}
      style={BUTTON_STYLE}
      {...props}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {loading ? (
          <motion.span
            key="loader"
            variants={LOADER_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={SWAP_TRANSITION}
            className="absolute flex items-center justify-center"
            aria-hidden="true"
          >
            {loader ?? (
              <HugeiconsIcon icon={Loading02Icon} className="size-4 animate-spin" size={16} />
            )}
          </motion.span>
        ) : (
          <motion.div
            key="content"
            className="flex items-center gap-2"
            variants={CONTENT_VARIANTS}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={SWAP_TRANSITION}
          >
            {leftIcon ? <span className="shrink-0">{leftIcon}</span> : null}
            <span>{children}</span>
            {rightIcon ? <span className="shrink-0">{rightIcon}</span> : null}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

ButtonRoot.displayName = 'Button';

// --- ButtonGroup ---

interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  attached?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

const ButtonGroup = ({
  className,
  children,
  orientation = 'horizontal',
  attached = false,
  ref,
  ...props
}: ButtonGroupProps) => {
  return (
    <div
      ref={ref}
      role="group"
      className={cn(
        'inline-flex',
        orientation === 'horizontal' ? 'flex-row' : 'flex-col',
        attached
          ? orientation === 'horizontal'
            ? '[&>button:not(:first-child)]:-ml-px [&>button:not(:first-child)]:rounded-l-none [&>button:not(:last-child)]:rounded-r-none'
            : '[&>button:not(:first-child)]:-mt-px [&>button:not(:first-child)]:rounded-t-none [&>button:not(:last-child)]:rounded-b-none'
          : 'gap-2',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};

ButtonGroup.displayName = 'ButtonGroup';

const Button = Object.assign(ButtonRoot, {
  Group: ButtonGroup,
});

export { Button, buttonVariants };
export type { ButtonGroupProps, ButtonProps };

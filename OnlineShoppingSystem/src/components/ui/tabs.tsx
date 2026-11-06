import * as React from 'react'
import { cn } from '@/lib/utils'

interface TabsProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
  className?: string
}

export function Tabs({ value, onValueChange, children, className }: TabsProps) {
  return (
    <div className={cn('w-full', className)}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            selectedValue: value,
            onSelect: onValueChange,
          } as any)
        }
        return child
      })}
    </div>
  )
}

interface TabsListProps {
  children: React.ReactNode
  className?: string
  selectedValue?: string
  onSelect?: (value: string) => void
}

export function TabsList({ children, className, selectedValue, onSelect }: TabsListProps) {
  return (
    <div
      className={cn(
        'inline-flex h-11 items-center justify-center rounded-xl bg-zinc-100 p-1 text-zinc-500 w-full',
        className
      )}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement<{ value?: string }>(child)) {
          return React.cloneElement(child, {
            isSelected: child.props.value === selectedValue,
            onClick: () => child.props.value && onSelect?.(child.props.value),
          } as any)
        }
        return child
      })}
    </div>
  )
}

interface TabsTriggerProps {
  value: string
  children: React.ReactNode
  className?: string
  isSelected?: boolean
  onClick?: () => void
}

export function TabsTrigger({
  children,
  className,
  isSelected,
  onClick,
}: TabsTriggerProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-xs sm:text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 flex-1',
        isSelected
          ? 'bg-white text-zinc-900 shadow-sm'
          : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50',
        className
      )}
    >
      {children}
    </button>
  )
}

interface TabsContentProps {
  value: string
  children: React.ReactNode
  selectedValue?: string
  className?: string
}

export function TabsContent({ value, children, selectedValue, className }: TabsContentProps) {
  if (value !== selectedValue) return null
  return <div className={cn('mt-4 focus-visible:outline-none', className)}>{children}</div>
}

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

export const Tabs = TabsPrimitive.Root;

const tabsListVariants = cva(
  'inline-flex items-center justify-center text-text-secondary',
  {
    variants: {
      variant: {
        default: 'h-10 rounded-md bg-light-gray p-1',
        line: 'h-16 gap-8 bg-transparent border-b-0 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface TabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>,
    VariantProps<typeof tabsListVariants> {}

export const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, variant = 'default', ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(tabsListVariants({ variant, className }))}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const tabsTriggerVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-body2-bold transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none',
  {
    variants: {
      variant: {
        default:
          'rounded-sm px-3 py-1.5 font-medium data-[state=active]:bg-white data-[state=active]:text-text-primary data-[state=active]:shadow-xs',
        line:
          'relative h-16 py-2 border-b-2 border-transparent text-text-secondary hover:text-black data-[state=active]:border-black data-[state=active]:text-black font-bold tracking-tight',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {}

export const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, variant = 'default', ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(tabsTriggerVariants({ variant, className }))}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

export const TabsContent = TabsPrimitive.Content;

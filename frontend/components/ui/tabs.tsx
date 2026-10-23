"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextType>({
  value: "",
  onValueChange: () => {},
});

export function Tabs({
  value,
  onValueChange,
  defaultValue,
  children,
  className,
}: {
  value?: string;
  onValueChange?: (val: string) => void;
  defaultValue?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [internalValue, setInternalValue] = React.useState(
    value || defaultValue || ""
  );

  const activeValue = value !== undefined ? value : internalValue;
  const handleValueChange = (val: string) => {
    if (onValueChange) {
      onValueChange(val);
    } else {
      setInternalValue(val);
    }
  };

  return (
    <TabsContext.Provider
      value={{ value: activeValue, onValueChange: handleValueChange }}
    >
      <div className={cn("w-full space-y-4", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-xl bg-slate-100 dark:bg-zinc-800/80 p-1 text-slate-500 dark:text-zinc-400 border border-slate-200/80 dark:border-zinc-800",
        className
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({
  value,
  children,
  className,
  icon,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}) {
  const { value: activeValue, onValueChange } = React.useContext(TabsContext);
  const isActive = activeValue === value;

  return (
    <button
      type="button"
      onClick={() => onValueChange(value)}
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-semibold ring-offset-background transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "bg-white dark:bg-zinc-900 text-slate-900 dark:text-white shadow-xs font-bold"
          : "hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-zinc-700/50",
        className
      )}
    >
      {icon}
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { value: activeValue } = React.useContext(TabsContext);
  if (activeValue !== value) return null;

  return (
    <div
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none animate-in fade-in-50 duration-200",
        className
      )}
    >
      {children}
    </div>
  );
}

"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

const Tabs = ({ defaultValue, value, onValueChange, className, children, ...props }) => {
  const [activeTab, setActiveTab] = React.useState(defaultValue || value)

  const handleValueChange = (newValue) => {
    setActiveTab(newValue)
    if (onValueChange) {
      onValueChange(newValue)
    }
  }

  return (
    <div className={cn("w-full", className)} {...props}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { activeTab, onValueChange: handleValueChange }),
      )}
    </div>
  )
}

const TabsList = ({ className, children, activeTab, onValueChange, ...props }) => (
  <div
    className={cn("inline-flex h-10 items-center justify-center rounded-md bg-gray-800 p-1 text-gray-300", className)}
    {...props}
  >
    {React.Children.map(children, (child) => React.cloneElement(child, { activeTab, onValueChange }))}
  </div>
)

const TabsTrigger = ({ className, value, children, activeTab, onValueChange, ...props }) => (
  <button
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      activeTab === value ? "bg-gray-700 text-white shadow-sm" : "text-gray-300 hover:text-white",
      className,
    )}
    onClick={() => onValueChange(value)}
    {...props}
  >
    {children}
  </button>
)

const TabsContent = ({ className, value, children, activeTab, ...props }) => {
  if (activeTab !== value) return null

  return (
    <div
      className={cn(
        "mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }

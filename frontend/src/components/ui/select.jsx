"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "../../lib/utils"

const Select = ({ children, value, onValueChange, ...props }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedValue, setSelectedValue] = React.useState(value)

  const handleValueChange = (newValue) => {
    setSelectedValue(newValue)
    setIsOpen(false)
    if (onValueChange) {
      onValueChange(newValue)
    }
  }

  return (
    <div className="relative" {...props}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          selectedValue,
          onValueChange: handleValueChange,
          isOpen,
          setIsOpen,
        }),
      )}
    </div>
  )
}

const SelectTrigger = React.forwardRef(({ className, children, selectedValue, isOpen, setIsOpen, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    onClick={() => setIsOpen(!isOpen)}
    {...props}
  >
    {children}
    <ChevronDown className="h-4 w-4 opacity-50" />
  </button>
))
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = ({ placeholder, selectedValue }) => (
  <span className={selectedValue ? "text-gray-900" : "text-gray-500"}>{selectedValue || placeholder}</span>
)

const SelectContent = ({ className, children, isOpen, onValueChange, ...props }) => {
  if (!isOpen) return null

  return (
    <div
      className={cn(
        "absolute top-full left-0 z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto",
        className,
      )}
      {...props}
    >
      {React.Children.map(children, (child) => React.cloneElement(child, { onValueChange }))}
    </div>
  )
}

const SelectItem = ({ className, children, value, onValueChange, ...props }) => (
  <div
    className={cn(
      "relative flex cursor-pointer select-none items-center py-2 px-3 text-sm hover:bg-gray-100 focus:bg-gray-100",
      className,
    )}
    onClick={() => onValueChange(value)}
    {...props}
  >
    {children}
  </div>
)

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }

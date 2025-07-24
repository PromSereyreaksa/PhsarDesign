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
    <div className="relative inline-block" {...props}>
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

const SelectTrigger = React.forwardRef(({ className, children, selectedValue, isOpen, setIsOpen, ...props }, ref) => {
  // Remove invalid DOM props before spreading
  const { onValueChange, ...validProps } = props
  
  return (
    <button
      ref={ref}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-gray-600 bg-black px-3 py-2 text-sm text-white placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      onClick={() => setIsOpen(!isOpen)}
      {...validProps}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
})
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = ({ placeholder, selectedValue }) => (
  <span className={selectedValue ? "text-white" : "text-gray-300"}>{selectedValue || placeholder}</span>
)

const SelectContent = ({ className, children, isOpen, onValueChange, selectedValue, setIsOpen, ...props }) => {
  if (!isOpen) return null

  return (
    <div
      className={cn(
        "absolute top-full left-0 z-50 w-full mt-1 bg-black border border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto",
        className,
      )}
      {...props}
    >
      {React.Children.map(children, (child) => React.cloneElement(child, { onValueChange }))}
    </div>
  )
}

const SelectItem = ({ className, children, value, onValueChange, ...props }) => {
  // Remove invalid DOM props before spreading
  const { selectedValue, setIsOpen, ...validProps } = props
  
  return (
    <div
      className={cn(
        "relative flex cursor-pointer select-none items-center py-2 px-3 text-sm text-white hover:bg-gray-800 focus:bg-gray-800",
        className,
      )}
      onClick={() => onValueChange(value)}
      {...validProps}
    >
      {children}
    </div>
  )
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }

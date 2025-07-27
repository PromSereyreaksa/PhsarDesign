"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "../../lib/utils"

const Select = ({ children, value, onValueChange, ...props }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedValue, setSelectedValue] = React.useState(value)

  // Update internal state when external value changes
  React.useEffect(() => {
    setSelectedValue(value)
  }, [value])

  const handleValueChange = (newValue) => {
    setSelectedValue(newValue)
    setIsOpen(false)
    if (onValueChange) {
      onValueChange(newValue)
    }
  }

  // Filter out non-DOM props
  const { className, ...validDOMProps } = props

  return (
    <div className={cn("relative inline-block", className)} {...validDOMProps}>
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
  // Remove all custom props that shouldn't be passed to DOM
  const { onValueChange, required, ...domProps } = props
  
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A95BAB]/50 focus:border-[#A95BAB]/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
        className,
      )}
      onClick={() => setIsOpen(!isOpen)}
      {...domProps}
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

  // Remove custom props that shouldn't be passed to DOM
  const { required, ...domProps } = props

  return (
    <div
      className={cn(
        "absolute top-full left-0 z-50 w-full mt-1 bg-gray-900/95 backdrop-blur-sm border border-white/20 rounded-xl shadow-xl max-h-60 overflow-auto",
        className,
      )}
      {...domProps}
    >
      {React.Children.map(children, (child) => React.cloneElement(child, { onValueChange }))}
    </div>
  )
}

const SelectItem = ({ className, children, value, onValueChange, ...props }) => {
  // Remove invalid DOM props before spreading
  const { selectedValue, setIsOpen, required, ...domProps } = props
  
  return (
    <div
      className={cn(
        "relative flex cursor-pointer select-none items-center py-3 px-4 text-sm text-white hover:bg-[#A95BAB]/20 hover:text-[#A95BAB] transition-all duration-200 first:rounded-t-xl last:rounded-b-xl",
        className,
      )}
      onClick={() => onValueChange(value)}
      {...domProps}
    >
      {children}
    </div>
  )
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }

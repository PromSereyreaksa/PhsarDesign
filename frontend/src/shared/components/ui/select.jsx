"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "../../utils/utils"

const Select = ({ children, value, onValueChange, className, disabled = false }) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const selectRef = React.useRef(null)

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleValueChange = (newValue) => {
    setIsOpen(false)
    if (onValueChange) {
      onValueChange(newValue)
    }
  }

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
    }
  }

  const selectContext = {
    value,
    onValueChange: handleValueChange,
    isOpen,
    onToggle: handleToggle,
    disabled
  }

  return (
    <div 
      ref={selectRef} 
      className={cn("relative w-full", className)}
      style={{ 
        zIndex: isOpen ? 999 : 'auto',
      }}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child) ? React.cloneElement(child, selectContext) : child
      )}
    </div>
  )
}

const SelectTrigger = React.forwardRef(({ className, children, isOpen, onToggle, disabled, ...props }, ref) => {
  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onToggle && !disabled) {
      onToggle()
    }
  }

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A95BAB]/50 focus:border-[#A95BAB]/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 hover:bg-white/15",
        className,
      )}
      onClick={handleClick}
      disabled={disabled}
      aria-expanded={isOpen}
      aria-haspopup="listbox"
      {...props}
    >
      {children}
      <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform duration-200", isOpen && "rotate-180")} />
    </button>
  )
})
SelectTrigger.displayName = "SelectTrigger"

const SelectValue = ({ placeholder, value }) => {
  return (
    <span className={value ? "text-white" : "text-gray-400"}>
      {value || placeholder}
    </span>
  )
}

const SelectContent = ({ className, children, isOpen, onValueChange, ...props }) => {
  if (!isOpen) return null

  return (
    <div
      className={cn(
        "absolute top-full left-0 w-full mt-1 bg-[#1a1a1a] border border-[#A95BAB]/30 rounded-xl shadow-2xl max-h-60 overflow-auto animate-in fade-in-0 zoom-in-95",
        className,
      )}
      style={{ 
        zIndex: 99999,
        position: 'absolute'
      }}
      role="listbox"
      onClick={(e) => e.stopPropagation()}
      {...props}
    >
      {React.Children.map(children, (child) => 
        React.isValidElement(child) ? React.cloneElement(child, { onValueChange }) : child
      )}
    </div>
  )
}

const SelectItem = ({ className, children, value, onValueChange, ...props }) => {
  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (onValueChange && value !== undefined) {
      onValueChange(value)
    }
  }
  
  return (
    <div
      className={cn(
        "relative flex cursor-pointer select-none items-center py-3 px-4 text-sm text-white hover:bg-[#A95BAB]/20 focus:bg-[#A95BAB]/20 outline-none transition-colors first:rounded-t-xl last:rounded-b-xl",
        className,
      )}
      onClick={handleClick}
      role="option"
      {...props}
    >
      {children}
    </div>
  )
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
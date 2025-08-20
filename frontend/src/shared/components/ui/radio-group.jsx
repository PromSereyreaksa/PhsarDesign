"use client"

import * as React from "react"
import { cn } from "../../utils/utils"

const RadioGroup = React.forwardRef(({ className, value, onValueChange, children, ...props }, ref) => {
  return (
    <div className={cn("grid gap-2", className)} {...props} ref={ref}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { selectedValue: value, onValueChange }),
      )}
    </div>
  )
})
RadioGroup.displayName = "RadioGroup"

const RadioGroupItem = React.forwardRef(({ className, value, selectedValue, onValueChange, ...props }, ref) => {
  // Remove invalid DOM props before spreading
  const { setIsOpen, ...validProps } = props
  
  return (
    <input
      type="radio"
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-gray-300 text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      checked={selectedValue === value}
      onChange={() => onValueChange && onValueChange(value)}
      {...validProps}
    />
  )
})
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }

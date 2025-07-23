"use client"

import * as React from "react"
import { cn } from "../../lib/utils"

const RadioGroup = React.forwardRef(({ className, value, onValueChange, ...props }, ref) => {
  return (
    <div className={cn("grid gap-2", className)} {...props} ref={ref}>
      {React.Children.map(props.children, (child) =>
        React.cloneElement(child, { selectedValue: value, onValueChange }),
      )}
    </div>
  )
})
RadioGroup.displayName = "RadioGroup"

const RadioGroupItem = React.forwardRef(({ className, value, selectedValue, onValueChange, ...props }, ref) => (
  <input
    type="radio"
    className={cn(
      "aspect-square h-4 w-4 rounded-full border border-gray-300 text-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    ref={ref}
    checked={selectedValue === value}
    onChange={() => onValueChange && onValueChange(value)}
    {...props}
  />
))
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }

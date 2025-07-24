import * as React from "react"
import { cn } from "../../lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-gray-600 bg-black px-3 py-2 text-sm text-white placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})

Input.displayName = "Input"

export { Input }

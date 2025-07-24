import * as React from "react"
import { cn } from "../../lib/utils"

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-gray-600 bg-black px-3 py-2 text-sm text-white placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})

Textarea.displayName = "Textarea"

export { Textarea }

import * as React from "react"
import { cn } from "../../utils/utils"

const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-green-600 text-white",
    secondary: "bg-gray-700 text-white",
    outline: "border border-gray-600 text-gray-300 bg-gray-800",
  }

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  )
})

Badge.displayName = "Badge"

export { Badge }

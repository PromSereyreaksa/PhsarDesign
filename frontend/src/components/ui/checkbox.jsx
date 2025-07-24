import * as React from "react"
import { cn } from "../../lib/utils"

const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <input
    type="checkbox"
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-gray-600 bg-black text-white focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:cursor-not-allowed disabled:opacity-50",
      className,
    )}
    ref={ref}
    {...props}
  />
))
Checkbox.displayName = "Checkbox"

export { Checkbox }

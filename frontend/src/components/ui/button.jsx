import * as React from "react"
import { cn } from "../../lib/utils"

const Button = React.forwardRef(({ className, variant = "default", size = "default", ...props }, ref) => {
  const variants = {
    default: "bg-green-600 text-white hover:bg-green-700",
    secondary: "bg-gray-700 text-white hover:bg-gray-600",
    outline: "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50",
    ghost: "text-gray-300 hover:bg-gray-800",
    dark: "bg-gray-800 text-white hover:bg-gray-700 border border-gray-600",
  }

  const sizes = {
    default: "px-4 py-2 text-sm",
    sm: "px-3 py-1.5 text-xs",
    lg: "px-6 py-3 text-base",
  }

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

Button.displayName = "Button"

export { Button }

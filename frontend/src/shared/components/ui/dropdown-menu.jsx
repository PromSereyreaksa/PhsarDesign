"use client"

import * as React from "react"
import { cn } from "../../utils/utils"

const DropdownMenu = ({ children }) => {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="relative inline-block text-left">
      {React.Children.map(children, (child) => React.cloneElement(child, { isOpen, setIsOpen }))}
    </div>
  )
}

const DropdownMenuTrigger = React.forwardRef(({ className, children, isOpen, setIsOpen, asChild, ...props }, ref) => {
  const Comp = asChild ? React.Fragment : "button"

  if (asChild) {
    return React.cloneElement(children, {
      onClick: () => setIsOpen(!isOpen),
      ref,
      ...props,
    })
  }

  return (
    <Comp ref={ref} className={className} onClick={() => setIsOpen(!isOpen)} {...props}>
      {children}
    </Comp>
  )
})
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

const DropdownMenuContent = ({ className, children, isOpen, align = "start", ...props }) => {
  if (!isOpen) return null

  const alignmentClasses = {
    start: "left-0",
    end: "right-0",
    center: "left-1/2 transform -translate-x-1/2",
  }

  return (
    <div
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-600 bg-black p-1 shadow-md",
        "top-full mt-1",
        alignmentClasses[align],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const DropdownMenuItem = ({ className, children, ...props }) => (
  <div
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm text-white outline-none hover:bg-gray-800 focus:bg-gray-800",
      className,
    )}
    {...props}
  >
    {children}
  </div>
)

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem }

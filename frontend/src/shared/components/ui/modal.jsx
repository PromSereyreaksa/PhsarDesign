"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "../../utils/utils"
import { Button } from "./button"

const Modal = ({ isOpen, onClose, className, children, ...props }) => {
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div
        className={cn(
          "relative bg-gray-900 border border-gray-700 rounded-lg shadow-xl max-w-md w-full mx-4 p-6",
          className
        )}
        {...props}
      >
        {/* Close Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        
        {children}
      </div>
    </div>
  )
}

const ModalHeader = ({ className, children, ...props }) => (
  <div className={cn("mb-4 pr-8", className)} {...props}>
    {children}
  </div>
)

const ModalTitle = ({ className, children, ...props }) => (
  <h2 className={cn("text-xl font-semibold text-white", className)} {...props}>
    {children}
  </h2>
)

const ModalDescription = ({ className, children, ...props }) => (
  <p className={cn("text-gray-300 mt-2", className)} {...props}>
    {children}
  </p>
)

const ModalContent = ({ className, children, ...props }) => (
  <div className={cn("", className)} {...props}>
    {children}
  </div>
)

const ModalFooter = ({ className, children, ...props }) => (
  <div className={cn("flex justify-end space-x-2 mt-6", className)} {...props}>
    {children}
  </div>
)

export { Modal, ModalHeader, ModalTitle, ModalDescription, ModalContent, ModalFooter }
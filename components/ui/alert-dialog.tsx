"use client"

import React from "react"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@heroui/react"
import { cn } from "@/lib/utils"

const AlertDialogContext = React.createContext<{
  isOpen: boolean
  onOpen: () => void
  onOpenChange: (open: boolean) => void
}>({
  isOpen: false,
  onOpen: () => {},
  onOpenChange: () => {},
})

const AlertDialog = ({ children, ...props }: { children: React.ReactNode }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  return <AlertDialogContext.Provider value={{ isOpen, onOpen, onOpenChange }}>{children}</AlertDialogContext.Provider>
}
AlertDialog.displayName = "AlertDialog"

const AlertDialogTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    const { onOpen } = React.useContext(AlertDialogContext)
    return <Button ref={ref} className={cn(className)} onClick={onOpen} {...props} />
  },
)
AlertDialogTrigger.displayName = "AlertDialogTrigger"

const AlertDialogContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { isOpen, onOpenChange } = React.useContext(AlertDialogContext)
    return (
      <Modal isOpen={isOpen} onClose={() => onOpenChange(false)}>
        <ModalContent ref={ref} className={cn(className)} {...props}>
          {children}
        </ModalContent>
      </Modal>
    )
  },
)
AlertDialogContent.displayName = "AlertDialogContent"

const AlertDialogHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <ModalHeader ref={ref} className={cn(className)} {...props} />
  },
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <ModalBody ref={ref} className={cn(className)} {...props} />
  },
)
AlertDialogBody.displayName = "AlertDialogBody"

const AlertDialogFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <ModalFooter ref={ref} className={cn(className)} {...props} />
  },
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => {
    return <h2 ref={ref} className={cn("text-lg font-semibold", className)} {...props} />
  },
)
AlertDialogTitle.displayName = "AlertDialogTitle"

const AlertDialogDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => {
    return <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  },
)
AlertDialogDescription.displayName = "AlertDialogDescription"

const AlertDialogAction = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    return <Button ref={ref} className={cn(className)} {...props} />
  },
)
AlertDialogAction.displayName = "AlertDialogAction"

const AlertDialogCancel = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    const { onOpenChange } = React.useContext(AlertDialogContext)
    return <Button ref={ref} className={cn(className)} onClick={() => onOpenChange(false)} {...props} />
  },
)
AlertDialogCancel.displayName = "AlertDialogCancel"

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}

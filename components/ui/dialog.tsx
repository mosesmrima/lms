"use client"

import React from "react"
import { Modal, ModalContent, ModalHeader, ModalFooter, Button, useDisclosure } from "@heroui/react"
import { cn } from "@/lib/utils"

const Dialog = ({ children, ...props }: { children: React.ReactNode }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  return <DialogContext.Provider value={{ isOpen, onOpen, onOpenChange }}>{children}</DialogContext.Provider>
}

type DialogContextType = {
  isOpen: boolean
  onOpen: () => void
  onOpenChange: (isOpen: boolean) => void
}

const DialogContext = React.createContext<DialogContextType | undefined>(undefined)

const useDialogContext = () => {
  const context = React.useContext(DialogContext)
  if (!context) {
    throw new Error("Dialog components must be used within a Dialog")
  }
  return context
}

const DialogTrigger = ({ children, ...props }: { children: React.ReactNode }) => {
  const { onOpen } = useDialogContext()

  return React.cloneElement(children as React.ReactElement, {
    onClick: onOpen,
    ...props,
  })
}

const DialogContent = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  const { isOpen, onOpenChange } = useDialogContext()

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} {...props}>
      <ModalContent className={cn(className)}>{children}</ModalContent>
    </Modal>
  )
}

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <ModalHeader className={cn(className)} {...props} />
}

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <ModalFooter className={cn(className)} {...props} />
}

const DialogTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
  return <h2 className={cn("text-lg font-semibold", className)} {...props} />
}

const DialogDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => {
  return <p className={cn("text-sm text-gray-500 dark:text-gray-400", className)} {...props} />
}

const DialogClose = ({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { onOpenChange } = useDialogContext()

  return <Button className={cn(className)} onClick={() => onOpenChange(false)} {...props} />
}

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose }

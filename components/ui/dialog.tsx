"use client"

import React from "react"
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@heroui/react"
import { cn } from "@/lib/utils"

const DialogContext = React.createContext<{
  isOpen: boolean
  onOpen: () => void
  onOpenChange: (open: boolean) => void
}>({
  isOpen: false,
  onOpen: () => {},
  onOpenChange: () => {},
})

const Dialog = ({ children, ...props }: { children: React.ReactNode }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  return <DialogContext.Provider value={{ isOpen, onOpen, onOpenChange }}>{children}</DialogContext.Provider>
}
Dialog.displayName = "Dialog"

const DialogTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    const { onOpen } = React.useContext(DialogContext)
    return <Button ref={ref} className={cn(className)} onClick={onOpen} {...props} />
  },
)
DialogTrigger.displayName = "DialogTrigger"

const DialogContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { isOpen, onOpenChange } = React.useContext(DialogContext)
    return (
      <Modal isOpen={isOpen} onClose={() => onOpenChange(false)}>
        <ModalContent ref={ref} className={cn(className)} {...props}>
          {children}
        </ModalContent>
      </Modal>
    )
  },
)
DialogContent.displayName = "DialogContent"

const DialogHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <ModalHeader ref={ref} className={cn(className)} {...props} />
  },
)
DialogHeader.displayName = "DialogHeader"

const DialogBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <ModalBody ref={ref} className={cn(className)} {...props} />
  },
)
DialogBody.displayName = "DialogBody"

const DialogFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <ModalFooter ref={ref} className={cn(className)} {...props} />
  },
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
  return <h2 className={cn("text-lg font-semibold", className)} {...props} />
}

const DialogDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => {
  return <p className={cn("text-sm text-gray-500 dark:text-gray-400", className)} {...props} />
}

const DialogClose = ({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const { onOpenChange } = React.useContext(DialogContext)

  return <Button className={cn(className)} onClick={() => onOpenChange(false)} {...props} />
}

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle, DialogDescription, DialogClose }

import type React from "react"
import { Accordion as HeroAccordion, AccordionItem as HeroAccordionItem } from "@heroui/react"
import { cn } from "@/lib/utils"

const Accordion = ({ className, ...props }: React.ComponentProps<typeof HeroAccordion>) => {
  return <HeroAccordion className={cn(className)} {...props} />
}

const AccordionItem = ({ className, ...props }: React.ComponentProps<typeof HeroAccordionItem>) => {
  return <HeroAccordionItem className={cn(className)} {...props} />
}

const AccordionTrigger = ({ className, children, ...props }: React.HTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={cn(
        "flex w-full items-center justify-between py-4 font-medium transition-all hover:underline",
        className,
      )}
      {...props}
    >
      {children}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4 transition-transform duration-200"
      >
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    </button>
  )
}

const AccordionContent = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("overflow-hidden text-sm transition-all", className)} {...props}>
      <div className="pb-4 pt-0">{children}</div>
    </div>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }

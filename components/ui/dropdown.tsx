"use client"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface DropdownOption {
  label: string
  value: string
}

interface DropdownProps {
  options: DropdownOption[]
  value?: string
  onSelect: (value: string) => void
  placeholder?: string
  className?: string
  buttonClassName?: string
  menuClassName?: string
  disabled?: boolean
}

export function Dropdown({
  options,
  value,
  onSelect,
  placeholder = "Select option",
  className,
  buttonClassName,
  menuClassName,
  disabled = false,
}: DropdownProps) {
  const selectedOption = options.find((option) => option.value === value)

  return (
    <div className={cn("relative", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={disabled}>
          <Button variant="outline" className={cn("w-full justify-between", buttonClassName)}>
            {selectedOption ? selectedOption.label : placeholder}
            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className={cn("w-full min-w-[8rem]", menuClassName)}>
          {options.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onSelect(option.value)}
              className={cn(option.value === value && "bg-accent font-medium")}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

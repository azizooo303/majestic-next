import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold rounded-none transition-[background-color,color,border-color,transform] duration-[250ms] ease-[cubic-bezier(0.4,0,0.2,1)] disabled:pointer-events-none disabled:bg-[#E7E7E7] disabled:text-[#3A3A3A] disabled:border-[#E7E7E7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2C2C2C] focus-visible:ring-offset-2 active:scale-[0.98] active:duration-[150ms]",
  {
    variants: {
      variant: {
        default:  "bg-[#2C2C2C] text-white border border-[#2C2C2C] hover:bg-[#3A3A3A] hover:border-[#3A3A3A]",
        primary:  "bg-[#2C2C2C] text-white border border-[#2C2C2C] hover:bg-[#3A3A3A] hover:border-[#3A3A3A]",
        outline:  "bg-white text-[#2C2C2C] border border-[#2C2C2C] hover:bg-[#F5F5F5]",
        ghost:    "bg-white text-[#2C2C2C] border border-[#2C2C2C] hover:bg-[#F5F5F5]",
        link:     "bg-transparent text-[#2C2C2C] border-0 border-b border-b-[#2C2C2C] rounded-none px-0 pb-[2px] h-auto hover:opacity-70",
        secondary: "bg-[#F5F5F5] text-[#2C2C2C] border border-[#D4D4D4] hover:bg-[#E7E7E7]",
        destructive: "bg-[#DC2626] text-white border border-[#DC2626] hover:bg-[#b91c1c]",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-[15px] font-semibold tracking-tight transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-[18px] [&_svg]:shrink-0 active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:opacity-90",
        secondary:
          "bg-[rgba(120,120,128,0.12)] text-foreground hover:bg-[rgba(120,120,128,0.18)]",
        outline:
          "border border-border bg-transparent text-primary hover:bg-[rgba(120,120,128,0.08)]",
        ghost:
          "text-foreground hover:bg-[rgba(120,120,128,0.12)]",
        link:
          "text-primary underline-offset-4 hover:underline font-medium",
        gold:
          "bg-gold text-white shadow-sm hover:opacity-90",
        soft:
          "bg-accent text-accent-foreground hover:opacity-90",
      },
      size: {
        default: "h-11 min-h-[44px] px-6",
        sm: "h-9 min-h-[36px] rounded-full px-4 text-[13px]",
        lg: "h-12 min-h-[48px] rounded-full px-8 text-[17px]",
        xl: "h-14 min-h-[56px] rounded-full px-10 text-[17px]",
        icon: "h-11 w-11 min-h-[44px] min-w-[44px]",
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

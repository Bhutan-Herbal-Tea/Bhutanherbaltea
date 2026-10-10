import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Focus uses an inset ring: the notch clip-path would cut off an outside outline.
const buttonVariants = cva(
  "notch inline-flex shrink-0 items-center justify-center gap-2 font-medium tracking-wide whitespace-nowrap outline-none select-none transition-[background-position,background-color,color] duration-500 ease-out active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "flag-hover text-ink focus-visible:shadow-[inset_0_0_0_3px_var(--color-ink)]",
        ink: "bg-ink text-mist hover:bg-ink/85 focus-visible:shadow-[inset_0_0_0_3px_var(--color-saffron)]",
        ghost: "text-foreground hover:bg-foreground/10 focus-visible:shadow-[inset_0_0_0_2px_var(--ring)]",
      },
      size: {
        default: "h-11 px-6 text-sm",
        lg: "h-12 px-7 text-[0.95rem]",
        icon: "size-11",
        "icon-sm": "size-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

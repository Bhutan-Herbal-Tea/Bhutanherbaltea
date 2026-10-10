import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 font-medium tracking-wide whitespace-nowrap select-none active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // Forest with mist text; flag sweep and ink text on hover. Saffron with ink text in dark mode.
        default: "flag-sweep text-mist dark:bg-saffron dark:text-ink",
        // For forest panels: mist with forest text.
        light: "bg-mist text-forest transition-colors hover:bg-saffron hover:text-ink focus-visible:outline-saffron",
        ghost: "text-foreground transition-colors hover:bg-foreground/10",
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

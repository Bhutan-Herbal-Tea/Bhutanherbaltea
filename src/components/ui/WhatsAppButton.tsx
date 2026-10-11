import { MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { contact } from "@/data/site";
import { whatsappHref } from "@/lib/contact";
import { cn } from "@/lib/utils";

type WhatsAppButtonProps = {
  label: string;
  message?: string; // prefills the chat
  variant?: "default" | "light";
  className?: string;
};

export function WhatsAppButton({ label, message, variant = "default", className }: WhatsAppButtonProps) {
  const href = whatsappHref(contact.whatsapp, message);
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(buttonVariants({ variant, size: "lg" }), className)}
    >
      <MessageCircle className="size-5" aria-hidden />
      {label}
    </a>
  );
}

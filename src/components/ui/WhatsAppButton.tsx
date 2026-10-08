import { MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { contact } from "@/data/site";
import { whatsappHref } from "@/lib/contact";
import { cn } from "@/lib/utils";

type WhatsAppButtonProps = { label: string; className?: string };

export function WhatsAppButton({ label, className }: WhatsAppButtonProps) {
  const href = whatsappHref(contact.whatsapp);
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(buttonVariants({ size: "lg" }), className)}
    >
      <MessageCircle className="size-5" aria-hidden />
      {label}
    </a>
  );
}

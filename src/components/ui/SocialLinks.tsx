import { contact, SITE_NAME } from "@/data/site";
import { socialLinks } from "@/lib/contact";
import { cn } from "@/lib/utils";
import { FacebookIcon, InstagramIcon } from "@/components/ui/SocialIcons";

const icons = { facebook: FacebookIcon, instagram: InstagramIcon };

export function SocialLinks({ className }: { className?: string }) {
  const links = socialLinks(contact);
  if (links.length === 0) return null;
  return (
    <ul className={cn("flex gap-3", className)}>
      {links.map((link) => {
        const Icon = icons[link.network];
        return (
          <li key={link.network}>
            <a
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${SITE_NAME} on ${link.label}`}
              className="notch inline-flex size-11 items-center justify-center bg-foreground/5 text-foreground outline-none transition-colors hover:bg-foreground/10 hover:text-accent-text focus-visible:shadow-[inset_0_0_0_2px_var(--ring)]"
            >
              <Icon className="size-5" aria-hidden />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

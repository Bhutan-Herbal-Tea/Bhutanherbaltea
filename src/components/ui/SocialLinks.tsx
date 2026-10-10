import { contact, SITE_NAME } from "@/data/site";
import { socialLinks } from "@/lib/contact";
import { cn } from "@/lib/utils";
import { FacebookIcon, InstagramIcon } from "@/components/ui/SocialIcons";

const icons = { facebook: FacebookIcon, instagram: InstagramIcon };

type SocialLinksProps = { className?: string; tone?: "default" | "onDark" };

export function SocialLinks({ className, tone = "default" }: SocialLinksProps) {
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
              className={cn(
                "inline-flex size-11 items-center justify-center border transition-colors",
                tone === "onDark"
                  ? "border-mist/30 text-mist hover:border-saffron hover:text-saffron focus-visible:outline-saffron"
                  : "border-border text-foreground hover:border-forest hover:text-forest dark:hover:border-saffron dark:hover:text-saffron",
              )}
            >
              <Icon className="size-5" aria-hidden />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

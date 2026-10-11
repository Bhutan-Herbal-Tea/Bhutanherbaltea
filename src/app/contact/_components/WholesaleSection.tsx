import { Mail } from "lucide-react";
import { contact } from "@/data/site";
import { contactPage } from "@/data/pages/contact";
import { mailtoHref } from "@/lib/contact";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

export function WholesaleSection() {
  const copy = contactPage.wholesale;
  const mail = mailtoHref(contact.email, copy.email);
  return (
    <section id="wholesale" aria-labelledby="wholesale-heading" className="scroll-mt-24 bg-forest text-mist dark:bg-card">
      <div className="container-page grid gap-12 py-20 md:py-24 xl:grid-cols-[7fr_5fr] xl:gap-20 xl:py-28">
        <Reveal>
          <p className="eyebrow text-saffron">{copy.eyebrow}</p>
          <h2 id="wholesale-heading" className="mt-4 max-w-2xl font-serif text-title">
            {copy.heading}
          </h2>
          {copy.paragraphs.map((paragraph) => (
            <p key={paragraph} className="mt-5 max-w-2xl text-lead text-mist/85">
              {paragraph}
            </p>
          ))}
          <div className="mt-8 flex flex-col gap-3 md:flex-row">
            {mail && (
              <a href={mail} className={buttonVariants({ variant: "light", size: "lg", className: "w-full md:w-auto" })}>
                <Mail className="size-5" aria-hidden />
                {copy.emailLabel}
              </a>
            )}
            <WhatsAppButton
              variant="light"
              label={contactPage.whatsappLabel}
              message={copy.whatsappMessage}
              className="w-full md:w-auto"
            />
          </div>
        </Reveal>
        <Reveal className="xl:pt-10">
          <h3 className="eyebrow text-saffron">{copy.audienceHeading}</h3>
          <ul className="mt-4 divide-y divide-mist/15 border-y border-mist/15">
            {copy.audience.map((who) => (
              <li key={who} className="py-3 font-serif text-xl">
                {who}
              </li>
            ))}
          </ul>
          <p className="mt-5 text-sm text-mist/75">{copy.note}</p>
        </Reveal>
      </div>
    </section>
  );
}

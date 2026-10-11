import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { contact } from "@/data/site";
import { contactPage } from "@/data/pages/contact";
import { hasDirectContact, mailtoHref, socialLinks, telHref } from "@/lib/contact";
import { PageHero } from "@/components/herbarium/PageHero";
import { Section } from "@/components/ui/Section";
import { SocialLinks } from "@/components/ui/SocialLinks";
import { SpecimenPlate } from "@/components/herbarium/SpecimenPlate";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { EnquiryLinks } from "./_components/EnquiryLinks";
import { VisitSection } from "./_components/VisitSection";
import { WholesaleSection } from "./_components/WholesaleSection";

export const metadata: Metadata = {
  title: contactPage.meta.title,
  description: contactPage.meta.description,
};

const detailLink = "flex items-center gap-3 text-lg text-foreground transition-colors hover:text-accent-text";

export default function ContactPage() {
  const tel = telHref(contact.phone);
  const mail = mailtoHref(contact.email);
  const hasSocials = socialLinks(contact).length > 0;

  return (
    <>
      <PageHero {...contactPage.hero} />
      <Section>
        <div className="grid gap-14 md:grid-cols-2 md:gap-12 xl:grid-cols-[1fr_1.4fr_1.4fr] xl:gap-16">
          <SpecimenPlate
            image={contactPage.sideImage}
            frameClassName="aspect-3/4"
            sizes="25vw"
            className="hidden self-start xl:block"
          />

          <section aria-labelledby="get-in-touch-heading">
            <h2 id="get-in-touch-heading" className="font-serif text-title text-foreground">
              {contactPage.getInTouchHeading}
            </h2>
            {hasDirectContact(contact) ? (
              <>
                <p className="mt-5 text-muted-foreground">{contactPage.getInTouchBody}</p>
                <div className="mt-8 flex flex-col items-start gap-5">
                  <WhatsAppButton label={contactPage.whatsappLabel} className="w-full md:w-auto" />
                  {tel && (
                    <a href={tel} className={detailLink}>
                      <Phone className="size-5" aria-hidden />
                      {contact.phone}
                    </a>
                  )}
                  {mail && (
                    <a href={mail} className={detailLink}>
                      <Mail className="size-5" aria-hidden />
                      {contact.email}
                    </a>
                  )}
                  {contact.address && (
                    <p className="flex items-center gap-3 text-lg text-foreground">
                      <MapPin className="size-5" aria-hidden />
                      {contact.address}
                    </p>
                  )}
                </div>
              </>
            ) : (
              <p className="mt-8 text-lead text-muted-foreground">{contactPage.comingSoon}</p>
            )}
            {hasSocials && (
              <div className="mt-12">
                <h3 className="eyebrow text-accent-text">{contactPage.followHeading}</h3>
                <SocialLinks className="mt-4" />
              </div>
            )}
          </section>

          <div className="flex flex-col gap-14">
            <EnquiryLinks />
            <section id="where-to-buy" aria-labelledby="where-to-buy-heading" className="scroll-mt-24">
              <h2 id="where-to-buy-heading" className="font-serif text-title text-foreground">
                {contactPage.whereToBuyHeading}
              </h2>
              {contact.whereToBuy.length > 0 ? (
                <ul className="mt-8 space-y-4">
                  {contact.whereToBuy.map((place) => (
                    <li key={place} className="flex gap-3 text-lg text-foreground">
                      <MapPin className="mt-1 size-5 shrink-0" aria-hidden />
                      {place}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-6 text-muted-foreground">{contactPage.whereToBuyComingSoon}</p>
              )}
            </section>
          </div>
        </div>
      </Section>
      <WholesaleSection />
      <VisitSection />
    </>
  );
}

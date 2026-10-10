import { ContactCta } from "@/components/home/ContactCta";
import { FeaturedTeas } from "@/components/home/FeaturedTeas";
import { GrownStrip } from "@/components/home/GrownStrip";
import { Hero } from "@/components/home/Hero";
import { StoryTeaser } from "@/components/home/StoryTeaser";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StoryTeaser />
      <FeaturedTeas />
      <GrownStrip />
      <ContactCta />
    </>
  );
}

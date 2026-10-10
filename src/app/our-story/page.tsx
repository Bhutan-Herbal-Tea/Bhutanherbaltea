import type { Metadata } from "next";
import { SUMMIT_ALTITUDE_M } from "@/data/site";
import { stages, storyPage } from "@/data/story";
import { stageLayout } from "@/lib/story";
import { PageHero } from "@/components/ui/PageHero";
import { ClimbStage } from "./_components/ClimbStage";
import { ClimbTrack } from "./_components/ClimbTrack";
import { Summit } from "./_components/Summit";

export const metadata: Metadata = {
  title: storyPage.meta.title,
  description: storyPage.meta.description,
};

export default function OurStoryPage() {
  return (
    <>
      <PageHero {...storyPage.hero} />
      <ClimbTrack summit={SUMMIT_ALTITUDE_M}>
        {stages.map((stage, index) => (
          <ClimbStage key={stage.id} stage={stage} layout={stageLayout(index)} />
        ))}
        <Summit />
      </ClimbTrack>
    </>
  );
}

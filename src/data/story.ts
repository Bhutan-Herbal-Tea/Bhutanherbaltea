import type { Photo } from "./site";

export type ClimbStageData = {
  id: string;
  heading: string;
  body: string;
  image: Photo;
};

export const storyPage = {
  meta: {
    title: "Our Story",
    description:
      "From a meeting in New York to Bhutan's first herbal tea farm: climb from sea level to our fields above 2,750 m in Thimphu.",
  },
  hero: {
    eyebrow: "Our story",
    title: "Grown higher",
    intro: "Scroll to climb, from sea level to our fields above 2,750 metres.",
    image: { src: "/images/fields/farm.jpg", alt: "The Bhutan Herbal Tea farm in the hills of Thimphu" },
  },
  stageLabel: "Stage",
  summit: {
    eyebrow: "The summit",
    heading: "You've reached the summit",
    body: "This is where our herbs grow: slowly, in the clean mountain air above Thimphu.",
    teasLabel: "Meet our teas",
    grownLabel: "How it's grown",
    image: { src: "/images/story/summit.jpg", alt: "Mountain ridges above the herb fields at sunset" },
  },
};

// Facts from Daily Bhutan (2023). TODO: client to review wording.
export const stages: ClimbStageData[] = [
  {
    id: "new-york",
    heading: "It began in New York",
    body: "Rinzin Wangchuk and Wangchuk Kuenga first crossed paths in New York, at a Bhutanese New Year gathering in 2007.",
    image: { src: "/images/story/stage-1.jpg", alt: "City lights at dusk" },
  },
  {
    id: "thimphu",
    heading: "Back home in Thimphu",
    body: "In 2015 they met again in Thimphu, and the idea of growing herbal tea in Bhutan began to take shape.",
    image: { src: "/images/story/stage-2.jpg", alt: "The Thimphu valley" },
  },
  {
    id: "founded",
    heading: "Bhutan's first herbal tea farm",
    body: "Bhutan Herbal Tea was founded in March 2016: the first and only herbal tea farm in Bhutan.",
    image: { src: "/images/story/stage-3.jpg", alt: "Young herb plants in rows on the farm" },
  },
  {
    id: "altitude",
    heading: "Above 2,750 metres",
    body: "Our herbs are grown and harvested above 9,000 feet. Up here, in the cool mountain air, they grow slowly.",
    image: { src: "/images/story/stage-4.jpg", alt: "High slopes above the farm" },
  },
  {
    id: "volatile-oils",
    heading: "Slow growth builds character",
    body: "Growing slowly, the plants build up more of the volatile oils that carry their flavour and fragrance.",
    image: { src: "/images/story/stage-5.jpg", alt: "Close-up of herb leaves" },
  },
  {
    id: "in-the-cup",
    heading: "Richer in every cup",
    body: "You can taste the altitude: richer flavour, deeper aroma and more nutrients in every cup.",
    image: { src: "/images/story/stage-6.jpg", alt: "A cup of herbal tea" },
  },
];

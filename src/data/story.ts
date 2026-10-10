import type { Photo } from "./site";

export type ClimbStageData = {
  id: string;
  marker: string; // short place or time, shown above the heading
  heading: string;
  body: string;
  image: Photo;
};

export type LungtaColor = { name: "blue" | "white" | "red" | "green" | "yellow"; hex: string };

// Prayer flags, in the traditional order of the five elements: sky, air, fire, water, earth.
export const LUNGTA_COLORS: LungtaColor[] = [
  { name: "blue", hex: "#2F5DA8" },
  { name: "white", hex: "#F4F1EA" },
  { name: "red", hex: "#C8322B" },
  { name: "green", hex: "#3F8F3A" },
  { name: "yellow", hex: "#F2C230" },
];

export const storyPage = {
  meta: {
    title: "Our Story",
    description:
      "From a meeting in New York to Bhutan's first herbal tea farm: climb from sea level to our fields above 2,750 m in Bumthang.",
  },
  hero: {
    title: "Grown higher",
    intro: "Climb from sea level to our fields above 2,750 metres.",
    image: { src: "/images/fields/farm.jpg", alt: "Golden fields below a Bhutanese building and forested mountains" },
  },
  summit: {
    heading: "You've reached the summit",
    body: "This is where our herbs grow: slowly, in the clean mountain air of Bumthang.",
    teasLabel: "See all teas",
    grownLabel: "How it's grown",
    image: { src: "/images/story/summit.jpg", alt: "Prayer flags on a post at a snowy mountain pass" },
  },
};

// Facts from Daily Bhutan (2023). TODO: client to review wording.
export const stages: ClimbStageData[] = [
  {
    id: "new-york",
    marker: "New York, 2007",
    heading: "It began far from the mountains",
    body: "Rinzin Wangchuk and Wangchuk Kuenga first crossed paths in New York, at a Bhutanese New Year gathering in 2007.",
    image: { src: "/images/story/stage-1.jpg", alt: "New York skyline at dusk across the river" },
  },
  {
    id: "thimphu",
    marker: "Thimphu, 2015",
    heading: "Back home in Thimphu",
    body: "In 2015 they met again in Thimphu, and the idea of growing herbal tea in Bhutan began to take shape.",
    image: { src: "/images/story/stage-2.jpg", alt: "The Thimphu valley seen past a line of prayer flags" },
  },
  {
    id: "founded",
    marker: "March 2016",
    heading: "Bhutan's first herbal tea farm",
    body: "Bhutan Herbal Tea was founded in March 2016: the first and only herbal tea farm in Bhutan.",
    image: { src: "/images/story/stage-3.jpg", alt: "Young seedlings growing in dark soil" },
  },
  {
    id: "altitude",
    marker: "Bumthang, above 9,000 feet",
    heading: "Above 2,750 metres",
    body: "Our herbs are grown and harvested above 9,000 feet in Bumthang, in central Bhutan. Up here, in the cool mountain air, they grow slowly.",
    image: { src: "/images/story/stage-4.jpg", alt: "Mountain ridges rising above the clouds" },
  },
  {
    id: "volatile-oils",
    marker: "Slow growth",
    heading: "Time builds flavour",
    body: "Growing slowly, the plants build up more of the volatile oils that carry their flavour and fragrance.",
    image: { src: "/images/story/stage-5.jpg", alt: "A hand holding a young plant with its roots" },
  },
  {
    id: "in-the-cup",
    marker: "In every cup",
    heading: "Richer in every cup",
    body: "You can taste the altitude: richer flavour, deeper aroma and more nutrients in every cup.",
    image: { src: "/images/story/stage-6.jpg", alt: "A cup of tea among dried herbs and spices" },
  },
];

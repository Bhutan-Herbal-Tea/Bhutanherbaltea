export type StageLayout = "image-left" | "image-right" | "full-bleed";

// Two image+text splits (alternating sides), then a full-bleed break, repeating.
export function stageLayout(index: number): StageLayout {
  const position = index % 3;
  if (position === 0) return "image-left";
  if (position === 1) return "image-right";
  return "full-bleed";
}

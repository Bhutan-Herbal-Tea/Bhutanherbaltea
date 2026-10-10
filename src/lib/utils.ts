import { createCn } from "cn/config"

// Our @theme text sizes (globals.css). Without this, cn reads text-display as a
// colour and drops the real colour class next to it.
export const cn = createCn({
  extend: { classGroups: { "font-size": [{ text: ["display", "title", "lead"] }] } },
})

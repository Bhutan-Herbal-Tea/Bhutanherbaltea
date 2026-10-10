import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { FARM_PLACE, SITE_NAME, SUMMIT_ALTITUDE_M, TAGLINE } from "@/data/site";
import { formatAltitude } from "@/lib/altitude";

export const alt = `${SITE_NAME}: ${TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public", "logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;
  const line = `Organic herbal teas grown above ${formatAltitude(SUMMIT_ALTITUDE_M)} in ${FARM_PLACE}, Bhutan`;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0E0E0C", color: "#F4F1EA" }}>
        <div style={{ display: "flex", flex: 1, alignItems: "center", gap: 56, padding: 72 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain img only */}
          <img src={logoSrc} width={280} height={254} alt="" />
          <div style={{ display: "flex", flexDirection: "column", width: 600 }}>
            <div style={{ fontSize: 64, lineHeight: 1 }}>{SITE_NAME}</div>
            <div style={{ marginTop: 20, fontSize: 40, color: "#F2C230" }}>{TAGLINE}</div>
            <div style={{ marginTop: 32, fontSize: 24, color: "#AFADA7" }}>{line}</div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            width: 150,
            height: "100%",
            backgroundImage: "linear-gradient(to bottom right, #F2C230 50%, #E86A1C 50%)",
          }}
        />
      </div>
    ),
    size,
  );
}

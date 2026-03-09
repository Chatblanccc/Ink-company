import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Ink Company — Stable color. Every run.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #0f1f0a 0%, #1a3310 50%, #243d16 100%)",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Left: text */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 620 }}>
          <div
            style={{
              fontSize: 13,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#8eb872",
              fontWeight: 600,
            }}
          >
            Industrial Ink Solutions
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
            }}
          >
            Stable color.{"\n"}Every run.
          </div>
          <div
            style={{
              fontSize: 20,
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.5,
              maxWidth: 500,
            }}
          >
            Water-based, UV &amp; specialty inks for packaging,
            labels, and commercial print — 28+ markets worldwide.
          </div>
          <div
            style={{
              marginTop: 8,
              display: "flex",
              gap: 32,
            }}
          >
            {[["28+", "Markets"], ["72h", "Sampling"], ["3,500+", "Formulas"]].map(
              ([val, label]) => (
                <div key={label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: 28, fontWeight: 700, color: "#dfecc6" }}>{val}</span>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</span>
                </div>
              ),
            )}
          </div>
        </div>

        {/* Right: logo mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
            border: "1.5px solid rgba(255,255,255,0.12)",
            fontSize: 80,
            color: "#dfecc6",
          }}
        >
          ◉
        </div>
      </div>
    ),
    { ...size },
  );
}

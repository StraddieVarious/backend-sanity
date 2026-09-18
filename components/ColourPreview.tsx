import type { CSSProperties, ReactNode } from "react";
import { TEXT, shadeOf, type Colours } from "../schemas/lib/colours";

/**
 * A small mock of the site in the chosen colours, with each area numbered to
 * match its colour field. Plain React and inline styles only, so it renders
 * the same inside the Studio and on its own.
 */

const marker: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 20,
  height: 20,
  borderRadius: 10,
  background: "#12181c",
  color: "#ffffff",
  fontSize: 11,
  fontWeight: 700,
  boxShadow: "0 0 0 2px #ffffff",
  flex: "none",
};

const Marker = ({ n }: { n: number }) => (
  <span aria-hidden="true" style={marker}>
    {n}
  </span>
);

const Tag = ({ n, children }: { n: number; children: ReactNode }) => (
  <span
    style={{
      position: "absolute",
      top: 8,
      right: 8,
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      padding: "2px 8px 2px 2px",
      borderRadius: 12,
      background: "rgba(255,255,255,0.94)",
      color: "#12181c",
      fontSize: 11,
      fontWeight: 600,
    }}
  >
    <Marker n={n} />
    {children}
  </span>
);

export function ColourPreview({ colours }: { colours: Colours }) {
  const shade = shadeOf(colours.background);
  return (
    <div
      role="img"
      aria-label="Preview of the website in these colours"
      style={{
        borderRadius: 6,
        overflow: "hidden",
        border: "1px solid rgba(127,127,127,0.4)",
        fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
        lineHeight: 1.4,
      }}
    >
      <div style={{ background: colours.background, padding: "38px 18px 18px", position: "relative" }}>
        <Tag n={1}>Page background</Tag>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <strong style={{ color: TEXT.ink, fontSize: 14 }}>Straddievarious</strong>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: TEXT.inkMuted }}>
            <span style={{ width: 8, height: 8, borderRadius: 4, background: colours.accent }} />
            Open now
            <Marker n={2} />
          </span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 140px", gap: 16, marginTop: 16, alignItems: "start" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: TEXT.ink }}>New work this week</div>
            <p style={{ margin: "6px 0 0", fontSize: 13, color: TEXT.inkMuted }}>
              Work by Redlands and Indigenous artists at Raby Bay Harbour, Cleveland.
            </p>
            <p style={{ margin: "10px 0 0", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: colours.accent, textDecoration: "underline" }}>A link, when you point at it</span>
              <Marker n={2} />
            </p>
          </div>
          <div style={{ background: shade, padding: 10, position: "relative" }}>
            <div style={{ height: 72, background: "#8d9aa1" }} />
            <span
              style={{
                position: "absolute",
                top: 14,
                left: 14,
                background: colours.accent,
                color: TEXT.onAccent,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.06em",
                padding: "2px 6px",
              }}
            >
              NEW
            </span>
            <div style={{ fontSize: 11, color: TEXT.inkFaint, marginTop: 6 }}>Artwork title · $620</div>
          </div>
        </div>
      </div>

      <div style={{ background: colours.banner, padding: "38px 18px 20px", position: "relative" }}>
        <Tag n={3}>Banner background</Tag>
        <div style={{ fontSize: 10, letterSpacing: "0.12em", color: TEXT.invertMuted }}>RABY BAY HARBOUR · CLEVELAND</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: TEXT.invert, marginTop: 4 }}>Straddievarious Gallery</div>
        <p style={{ margin: "6px 0 14px", fontSize: 13, color: TEXT.invertMuted }}>
          Art in Raby Bay by local and Indigenous artists.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
          <span
            style={{
              background: colours.bannerButton,
              color: TEXT.onButton,
              fontSize: 12,
              fontWeight: 700,
              padding: "8px 14px",
            }}
          >
            View the collection
          </span>
          <Marker n={4} />
          <span
            style={{
              border: `1px solid ${TEXT.invertMuted}`,
              color: TEXT.invert,
              fontSize: 12,
              padding: "7px 13px",
              marginLeft: 6,
            }}
          >
            Plan your visit
          </span>
        </div>
      </div>

      <div style={{ background: shade, padding: "10px 18px", fontSize: 11, color: TEXT.inkMuted }}>
        Footer and picture mats use a slightly darker shade of 1, made automatically.
      </div>
    </div>
  );
}

import type { ColourRole } from "../schemas/lib/colours";

/** Numbered so the preview can point at each part of the site. */
export const ROLE_LABELS: Record<ColourRole, string> = {
  background: "1. Page background",
  accent: "2. Accent colour",
  banner: "3. Banner background",
  bannerButton: "4. Banner button",
};

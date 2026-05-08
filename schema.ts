import type { SchemaTypeDefinition } from "sanity";
import { artist } from "./schemas/artist";
import { artwork } from "./schemas/artwork";
import { homePage } from "./schemas/homePage";
import { galleryPage } from "./schemas/galleryPage";
import { artistsPage } from "./schemas/artistsPage";
import { aboutPage } from "./schemas/aboutPage";
import { contactPage } from "./schemas/contactPage";
import { siteSettings } from "./schemas/siteSettings";
import { seo } from "./schemas/objects/seo";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    homePage,
    galleryPage,
    artistsPage,
    aboutPage,
    contactPage,
    artist,
    artwork,
    siteSettings,
    seo,
  ],
};

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schema } from "./schema";

const projectId = "amp8e9rk";
const dataset = "production";
const apiVersion = "2025-01-01";

export default defineConfig({
  name: "default",
  title: "Straddievarious",
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            // Pages
            S.listItem()
              .title("📄 Pages")
              .child(
                S.list()
                  .title("Pages")
                  .items([
                    S.listItem()
                      .title("Home Page")
                      .id("homePage")
                      .child(
                        S.document()
                          .schemaType("homePage")
                          .documentId("homePage")
                      ),
                    S.listItem()
                      .title("Gallery Page")
                      .id("galleryPage")
                      .child(
                        S.document()
                          .schemaType("galleryPage")
                          .documentId("galleryPage")
                      ),
                    S.listItem()
                      .title("Artists Page")
                      .id("artistsPage")
                      .child(
                        S.document()
                          .schemaType("artistsPage")
                          .documentId("artistsPage")
                      ),
                    S.listItem()
                      .title("About Page")
                      .id("aboutPage")
                      .child(
                        S.document()
                          .schemaType("aboutPage")
                          .documentId("aboutPage")
                      ),
                    S.listItem()
                      .title("Contact Page")
                      .id("contactPage")
                      .child(
                        S.document()
                          .schemaType("contactPage")
                          .documentId("contactPage")
                      ),
                  ])
              ),
            S.divider(),
            S.documentTypeListItem("artist").title("🎨 Artists"),
            S.documentTypeListItem("artwork").title("🖼️ Artworks"),
            S.documentTypeListItem("artworkType").title("🏷️ Artwork Types"),
            S.divider(),
            S.listItem()
              .title("⚙️ Site Settings")
              .id("siteSettings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
              ),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});

const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/api/slides", (_req, res) => {
  const slideshowDir = path.join(__dirname, "..", "public", "images", "slideshow");
  let files = [];

  try {
    files = fs.readdirSync(slideshowDir, { withFileTypes: true })
      .filter((dirent) => dirent.isFile())
      .map((dirent) => dirent.name);
  } catch (_err) {
    files = [];
  }

  const preferredExt = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"];

  const byBase = new Map();
  for (const name of files) {
    const ext = path.extname(name).toLowerCase();
    if (!preferredExt.includes(ext)) continue;
    const base = path.basename(name, ext);
    const existing = byBase.get(base);
    if (!existing) {
      byBase.set(base, name);
      continue;
    }

    const existingExt = path.extname(existing).toLowerCase();
    if (preferredExt.indexOf(ext) < preferredExt.indexOf(existingExt)) byBase.set(base, name);
  }

  const slides = Array.from(byBase.entries())
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }))
    .map(([, name]) => `/images/slideshow/${encodeURIComponent(name)}`);

  res.set("Cache-Control", "no-store");
  res.json(slides);
});

app.get("/", (_req, res) => res.render("index", { title: "GreenAge", active: "home", bodyClass: "homepage" }));
app.get("/gallery", (_req, res) => res.render("page", { title: "Gallery - GreenAge", active: "gallery", bodyClass: "subpage" }));
app.get("/news", (_req, res) => res.render("page", { title: "News - GreenAge", active: "news", bodyClass: "subpage" }));
app.get("/blog", (_req, res) => res.render("page", { title: "Blog - GreenAge", active: "blog", bodyClass: "subpage" }));
app.get("/contact", (_req, res) => res.render("page", { title: "Contact - GreenAge", active: "contact", bodyClass: "subpage" }));

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on http://localhost:${port}`);
});

const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/", (_req, res) => {
  res.render("index", { title: "GreenAge" });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on http://localhost:${port}`);
});


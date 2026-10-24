// Build: npx tailwindcss@3 -c v2/tailwind.config.js -i v2/src/input.css -o v2/tailwind.css --minify
// (run from the repo root after changing classes in v2/app.js)
module.exports = {
  content: ["./v2/index.html", "./v2/app.js"],
  theme: {
    extend: {
      colors: {
        ink: "#0e0e0d",
        panel: "#141413",
        raised: "#1b1b19",
        line: "#2a2926",
        fg: "#ebe8e0",
        dim: "#9a968b",
        faint: "#5f5c55",
        accent: "#e9a23b",
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
    },
  },
};

// ─────────────────────────────────────────────────────────────
//  The art page. Each series is one piece (a comic or a set),
//  and its pages show in the order listed.
//
//  Captions:  `caption` sits under the piece. A page can carry its
//             own caption too: write it as { file: "name", caption: "…" }.
//             Leave a caption "" and nothing shows.
//  Regroup:   move a filename from one series' `pages` to another.
//  Add art:   put a full-size image (about 1800px) in assets/art/ and a
//             small copy (about 640px) with the same name in assets/art/thumbs/.
//  Video:     { file: "name", video: true } plays assets/art/name.mp4,
//             using name.webp as its still.
// ─────────────────────────────────────────────────────────────

window.ART = [
  {
    title: "Shadi",
    kind: "comic · color",
    caption: "The story of my brother Usama's wedding in Islamabad, from the invitation to the last page.",
    pages: ["shaadi-1", "shaadi-2", "shaadi-3", "shaadi-4", "shaadi-5", "shaadi-6", "shaadi-7"],
  },
  {
    title: "Simoh · سائیں",
    kind: "comic · ink",
    caption: "",
    pages: [
      "saeen-1", "saeen-2", "saeen-3", "saeen-4", "saeen-5",
      { file: "saeen-6", caption: "Process: blue-line layouts before the ink." },
    ],
  },
  {
    title: "Remembering Noor Jahan",
    kind: "comic · ink",
    caption: "نور جہاں کی کہانی · the story of Noor Jahan the elephant.",
    pages: ["noor-jahan-1", "noor-jahan-2", "noor-jahan-3", "noor-jahan-4"],
  },
  {
    title: "The Flight",
    kind: "comic · ink",
    caption: "",
    pages: ["the-flight-1", "the-flight-2"],
  },
  {
    title: "Navigating the CXC '23",
    kind: "comic · ink",
    caption: "",
    pages: ["navigating-cxc-1", "navigating-cxc-2"],
  },
  {
    title: "Pakistan",
    kind: "marker · award",
    caption: "",
    pages: [
      "pakistan-1",
      { file: "pakistan-2", caption: "Framed for the exhibition." },
      { file: "pakistan-3", caption: "4th prize and a gold medal at the 13th ARTBEAT National Child Art Competition, 2022." },
    ],
  },
  {
    title: "Girls in Tech",
    kind: "marker · chalk",
    caption: "",
    pages: ["girls-in-tech-1", "girls-in-tech-2", "girls-in-tech-3"],
  },
  {
    title: "C.O.A.T.",
    kind: "paper doll · marker",
    caption: "",
    pages: ["coat-1", "coat-2", { file: "coat-3", video: true, caption: "" }],
  },
  {
    title: "nu.chai",
    kind: "packaging · ink",
    caption: "",
    pages: ["nu-chai"],
  },
  {
    title: "Self portrait",
    kind: "marker",
    caption: "",
    pages: ["portrait"],
  },
  {
    title: "Sketches",
    kind: "pencil · works in progress",
    caption: "",
    pages: ["sketch-1", "sketch-2", "sketch-3"],
  },
];

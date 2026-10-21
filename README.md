# Shizza Shafqat · Portfolio

A hand-drawn, interactive portfolio: CS at Denison University, building AI, software, and products, and drawing all of it.

Live at **https://shizzashafqat.github.io/portfolio**

## What's inside

- A minimal, monochrome, terminal-flavored layout; my Denison doodle colors in under your cursor
- A lens switch (AI engineer / software engineer / product manager) that re-sorts and highlights the whole site
- Single-line drawings that draw themselves on scroll: a New York skyline, the places I have worked, and a spirit animal for every project (owl, elephant, bee, penguins)
- A sketchbook gallery (grayscale until hover) with a lightbox
- An art page (`art.html`) with each piece shown big in its own viewer, a caption under it, and a full-screen reader (arrow keys and swipe)
- Plain HTML, CSS, and JavaScript. No frameworks, no build step

## Updating the site

Almost everything lives in **`assets/content.js`**:

| To add… | Do this |
| --- | --- |
| A doodle | Put the image in `assets/doodles/`, add `{ src, title, note }` to `doodles` |
| A photo | Put it in `assets/photos/`, add `{ src, caption }` to `photos` |
| A project link | Add `{ label, href }` to that project's `links` |
| A project screenshot | Set that project's `image` to the file path |
| App screens under a project | Put them in `assets/projects/` and add `{ src, caption }` to that project's `screens` |
| A comic or artwork | Put it in `assets/art/` plus a ~640px copy in `assets/art/thumbs/`, then list it in `assets/art.js` |
| A caption under a piece | Edit `caption` for that piece in `assets/art.js`, or give one page its own `{ file, caption }` |
| Photos or a video under a project | Put them in `assets/projects/` and add `{ type: "image" or "video", src, caption }` to that project's `media` |
| Your resume | Drop the PDF in `assets/` and set `resume` |

`lens` tags (`ai`, `swe`, `pm`) decide what lights up for each role.

## Run locally

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

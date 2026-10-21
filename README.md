# Shizza Shafqat · Portfolio

A hand-drawn, interactive portfolio: CS at Denison University, building AI, software, and products, and drawing all of it.

Live at **https://shizzashafqat.github.io/portfolio**

## What's inside

- A minimal black-and-white layout; my Denison doodle colors in under your cursor
- A lens switch (AI engineer / software engineer / product manager) that re-sorts and highlights the whole site
- Single-line drawings of Islamabad, Seattle, Denison, and New York with a slight hand-drawn tremble
- A sketchbook gallery (grayscale until hover) with a lightbox
- Plain HTML, CSS, and JavaScript. No frameworks, no build step

## Updating the site

Almost everything lives in **`assets/content.js`**:

| To add… | Do this |
| --- | --- |
| A doodle | Put the image in `assets/doodles/`, add `{ src, title, note }` to `doodles` |
| A photo | Put it in `assets/photos/`, add `{ src, caption }` to `photos` |
| A project link | Add `{ label, href }` to that project's `links` |
| A project screenshot | Set that project's `image` to the file path |
| Your resume | Drop the PDF in `assets/` and set `resume` |

`lens` tags (`ai`, `swe`, `pm`) decide what lights up for each role.

## Run locally

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

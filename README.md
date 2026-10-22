# Shizza Shafqat · Portfolio

A hand-drawn, interactive portfolio: CS at Denison University, building AI, software, and products, and drawing all of it.

Live at **https://shizzashafqat.github.io/portfolio**

## What's inside

- A minimal, monochrome, terminal-flavored layout; my Denison doodle colors in under your cursor
- An about.txt block at the top; pick a role (data science / software engineering / product management) to see the projects for it
- Single-line drawings that draw themselves on scroll: a New York skyline and Denison
- Each project shows real screens, photos or video, and a "no image" box until one is added
- An art page (`art.html`) with every page of every piece laid out big, caption space under each page and piece, and a full-screen reader (arrow keys and swipe)
- Plain HTML, CSS, and JavaScript. No frameworks, no build step

## Updating the site

Almost everything lives in **`assets/content.js`**:

| To add… | Do this |
| --- | --- |
| A project link | Add `{ label, href }` to that project's `links` |
| A project screenshot | Set that project's `image` to the file path |
| App screens under a project | Put them in `assets/projects/` and add `{ src, caption }` to that project's `screens` |
| A comic or artwork | Put it in `assets/art/` plus a ~640px copy in `assets/art/thumbs/`, then list it in `assets/art.js` |
| A caption under a piece | Edit `caption` for that piece in `assets/art.js`, or give one page its own `{ file, caption }` |
| Photos or a video under a project | Put them in `assets/projects/` and add `{ type: "image" or "video", src, caption }` to that project's `media` |
| Your resume | Drop the PDF in `assets/` and set `resume` |

`lens` tags (`ds`, `swe`, `pm`) decide what lights up for each role.

## Run locally

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

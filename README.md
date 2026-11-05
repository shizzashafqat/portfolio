# Shizza Shafqat · Portfolio

A hand-drawn, interactive portfolio: CS at Denison University, building AI, software, and products, and drawing all of it.

Live at **https://shizzashafqat.github.io/portfolio/v2/** (the root URL redirects there)

## What's inside

- A code-editor themed site in `v2/`: tabs for home, projects, artwork, At Denison, and contact (keys 1 to 5 switch tabs)
- Pick a role (data science / software engineering / product management) to see the projects for it
- Each project shows real screens, photos or video, or, for shipped work that can't be shown, a note and a paper plane taking off
- An artwork tab with every page of every piece and a full-screen reader (arrow keys and swipe)
- React + htm vendored in `v2/vendor/`, styled with Tailwind (rebuild `v2/tailwind.css` with the command in `v2/tailwind.config.js` after changing classes)
- The root `index.html` and `art.html` only redirect to `v2/`, so old links keep working

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
| A note for shipped work you can't show | Set `shipped` on that project (shown with a paper plane when it has no screens or media) |
| A "why" line for a project | Set `why` on that project: who it was for and what you decided because of them |
| The bio or highlights at the top | Edit `bio` and `highlights` |
| The CS Department Fellow honor (home badge + At Denison entry) | Edit `fellowship`; the poster lives in `assets/fellow/` |
| The photo in Contact | Replace `assets/me/shizza-900.webp` (900×1125, 4:5) and the 480px copy, or point `photo` at new files |
| Your resume | Drop the PDF in `assets/` and set `resume`; every resume link then opens the PDF directly |

`lens` tags (`ds`, `swe`, `pm`) decide what lights up for each role.

## Run locally

```sh
python3 -m http.server 8000
# then open http://localhost:8000/v2/
```

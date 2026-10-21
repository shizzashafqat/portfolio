const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const pad = (n) => String(n).padStart(2, "0");
const full = (p) => `assets/art/${p}.webp`;
const thumb = (p) => `assets/art/thumbs/${p}.webp`;
const clip = (p) => `assets/art/${p}.mp4`;
const slug = (t) => t.toLowerCase().replace(/\./g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "series";

// Pages can be written as "name" or { file, caption, video } in art.js
const ART = window.ART.map((s) => ({
  ...s,
  slug: slug(s.title),
  pages: s.pages.map((p) => (typeof p === "string" ? { file: p } : p)),
}));
const count = (n) => `${n} ${n === 1 ? "piece" : "pages"}`;

function media(pg, alt, cls = "") {
  return pg.video
    ? `<video class="${cls}" src="${clip(pg.file)}" poster="${full(pg.file)}" muted loop playsinline autoplay preload="metadata" aria-label="${esc(alt)}"></video>`
    : `<img class="${cls}" src="${full(pg.file)}" alt="${esc(alt)}" loading="lazy" decoding="async">`;
}

function render() {
  const total = ART.reduce((n, s) => n + s.pages.length, 0);
  $("#artIndex").innerHTML = `<p class="label">total ${total}</p>` + ART.map((s) => `
    <a href="#${s.slug}" class="ls-row">
      <span class="perm">drwxr-xr-x</span><span class="n">${pad(s.pages.length)}</span>
      <span class="kind">${esc(s.kind)}</span><span class="dir"><bdi>${esc(s.title)}</bdi>/</span>
    </a>`).join("");

  $("#series").innerHTML = ART.map((s, si) => `
    <section class="section series reveal" id="${s.slug}">
      <div class="section-head">
        <span class="label">${pad(si + 1)}</span><h2>${esc(s.title)}</h2>
        <span class="label meta">${esc(s.kind)} · ${count(s.pages.length)}</span>
      </div>
      <figure class="viewer frame" data-s="${si}" tabindex="0" aria-label="${esc(s.title)}, use arrow keys to turn pages">
        <div class="vbar mono">
          <span class="path"></span>
          <span class="xy">x —.— y —.—</span>
          <span class="count"></span>
          <button class="open" aria-label="Open full screen">[ full screen ]</button>
        </div>
        <div class="stage">
          <div class="slot"></div>
          ${s.pages.length > 1 ? `
          <button class="hit prev" aria-label="Previous page"><span class="mono">←</span></button>
          <button class="hit next" aria-label="Next page"><span class="mono">→</span></button>` : ""}
        </div>
        ${s.pages.length > 1 ? `
        <div class="strip">
          ${s.pages.map((pg, pi) => `
            <button class="tab" data-p="${pi}" aria-label="Page ${pi + 1}">
              <img src="${thumb(pg.file)}" alt="" loading="lazy">
              <span class="label">${pad(pi + 1)}${pg.video ? " ▸" : ""}</span>
            </button>`).join("")}
        </div>` : ""}
        <figcaption>
          <span class="label">caption ›</span>
          <p class="cap-series">${esc(s.caption || "")}</p>
          <p class="cap-page"></p>
        </figcaption>
      </figure>
    </section>`).join("");

  document.querySelectorAll(".viewer").forEach((v) => go(v, 0));
  $("#year").textContent = new Date().getFullYear();
}

// ── Inline viewer: one big page at a time ──
const at = new WeakMap();
function go(v, p) {
  const s = ART[+v.dataset.s];
  if (p < 0 || p >= s.pages.length) return;
  at.set(v, p);
  const pg = s.pages[p];
  const slot = $(".slot", v);
  slot.innerHTML = media(pg, `${s.title}, page ${p + 1}`, "art");
  const el = slot.firstElementChild;
  el.classList.add("wipe");
  const done = () => requestAnimationFrame(() => el.classList.add("on"));
  if (pg.video || el.complete) done(); else el.addEventListener("load", done, { once: true });

  $(".path", v).textContent = `${s.slug}/p${pad(p + 1)}.${pg.video ? "mp4" : "webp"}`;
  $(".count", v).textContent = `${pad(p + 1)} / ${pad(s.pages.length)}`;
  $(".cap-page", v).textContent = pg.caption || "";
  v.querySelectorAll(".tab").forEach((t) => t.classList.toggle("on", +t.dataset.p === p));
  const prev = $(".prev", v), next = $(".next", v);
  if (prev) prev.disabled = p === 0;
  if (next) next.disabled = p === s.pages.length - 1;
  // Warm the next page
  const n = s.pages[p + 1];
  if (n && !n.video) new Image().src = full(n.file);
}

function setupViewers() {
  const root = $("#series");
  root.addEventListener("click", (e) => {
    const v = e.target.closest(".viewer");
    if (!v) return;
    const p = at.get(v);
    if (e.target.closest(".prev")) go(v, p - 1);
    else if (e.target.closest(".next")) go(v, p + 1);
    else if (e.target.closest(".tab")) go(v, +e.target.closest(".tab").dataset.p);
    else if (e.target.closest(".open, .art")) openReader(+v.dataset.s, p);
  });
  root.addEventListener("keydown", (e) => {
    const v = e.target.closest(".viewer");
    if (!v || e.target !== v) return;
    if (e.key === "ArrowRight") { go(v, at.get(v) + 1); e.preventDefault(); }
    if (e.key === "ArrowLeft") { go(v, at.get(v) - 1); e.preventDefault(); }
    if (e.key === "Enter") openReader(+v.dataset.s, at.get(v));
  });
  // Cursor readout, like a measuring tool
  root.addEventListener("pointermove", (e) => {
    const el = e.target.closest(".art");
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    $(".xy", el.closest(".viewer")).textContent = `x ${x.toFixed(2)} y ${y.toFixed(2)}`;
  });
  root.addEventListener("pointerout", (e) => {
    if (e.target.closest?.(".art")) $(".xy", e.target.closest(".viewer")).textContent = "x —.— y —.—";
  });
  swipe(root, ".stage", (el, d) => { const v = el.closest(".viewer"); go(v, at.get(v) + d); });
}

function swipe(el, sel, fn) {
  let x0 = null, t = null;
  el.addEventListener("touchstart", (e) => { t = e.target.closest(sel); x0 = e.touches[0].clientX; }, { passive: true });
  el.addEventListener("touchend", (e) => {
    if (x0 === null || !t) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) fn(t, dx < 0 ? 1 : -1);
    x0 = null;
  });
}

// ── Reader: full-screen, page by page ──
let cur = { s: 0, p: 0 };
function show() {
  const s = ART[cur.s], pg = s.pages[cur.p];
  $("#rMedia").innerHTML = media(pg, `${s.title}, page ${cur.p + 1}`);
  $("#rTitle").textContent = s.title;
  $("#rCount").textContent = `${pad(cur.p + 1)} / ${pad(s.pages.length)}`;
  $("#rCap").textContent = [s.caption, pg.caption].filter(Boolean).join("  ·  ");
  $("#rPrev").disabled = cur.p === 0;
  $("#rNext").disabled = cur.p === s.pages.length - 1;
  const next = s.pages[cur.p + 1];
  if (next && !next.video) new Image().src = full(next.file);
}
const step = (d) => {
  const n = cur.p + d;
  if (n >= 0 && n < ART[cur.s].pages.length) { cur.p = n; show(); }
};
function openReader(s, p) {
  cur = { s, p };
  show();
  $("#reader").hidden = false;
  document.body.style.overflow = "hidden";
  $("#rClose").focus();
}
function setupReader() {
  const r = $("#reader");
  const close = () => {
    r.hidden = true;
    $("#rMedia").innerHTML = "";
    document.body.style.overflow = "";
    // keep the inline viewer on the page you stopped at
    const v = document.querySelector(`.viewer[data-s="${cur.s}"]`);
    go(v, cur.p);
    v.focus({ preventScroll: true });
  };
  $("#rPrev").addEventListener("click", () => step(-1));
  $("#rNext").addEventListener("click", () => step(1));
  $("#rClose").addEventListener("click", close);
  r.addEventListener("click", (e) => { if (e.target === r || e.target.id === "rMedia") close(); });
  addEventListener("keydown", (e) => {
    if (r.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });
  swipe(r, "#rMedia", (_, d) => step(d));
}

function setupScrollReveal() {
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.05 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
}

render();
setupViewers();
setupReader();
setupScrollReveal();
// The sections are built here, so jump to a #piece link once they exist
if (location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();

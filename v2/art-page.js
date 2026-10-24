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
    <a href="v2/art.html#${s.slug}" class="ls-row">
      <span class="perm">drwxr-xr-x</span><span class="n">${pad(s.pages.length)}</span>
      <span class="kind">${esc(s.kind)}</span><span class="dir"><bdi>${esc(s.title)}</bdi>/</span>
    </a>`).join("");

  // Every page of every piece is on the page; click one to read full screen
  $("#series").innerHTML = ART.map((s, si) => `
    <section class="section series" id="${s.slug}">
      <div class="section-head">
        <span class="label">${pad(si + 1)}</span><h2>${esc(s.title)}</h2>
        <span class="label meta">${esc(s.kind)} · ${count(s.pages.length)}</span>
      </div>
      <div class="wall${s.pages.length === 1 ? " solo" : ""}">
        ${s.pages.map((pg, pi) => `
          <figure class="plate reveal" data-s="${si}" data-p="${pi}">
            <div class="vbar mono">
              <span class="path">${s.slug}/p${pad(pi + 1)}.${pg.video ? "mp4" : "webp"}</span>
              <span class="xy">x —.— y —.—</span>
              <span class="count">${pad(pi + 1)} / ${pad(s.pages.length)}</span>
            </div>
            <button class="shot" aria-label="Open ${esc(s.title)}, page ${pi + 1}, full screen">
              ${media(pg, `${s.title}, page ${pi + 1}`, "art wipe")}
            </button>
            <figcaption><span class="label">p.${pad(pi + 1)} ›</span><p>${esc(pg.caption || "")}</p></figcaption>
          </figure>`).join("")}
      </div>
      <p class="cap-series"><span class="label">caption ›</span> <span>${esc(s.caption || "")}</span></p>
    </section>`).join("");

  // Landscape pages take the full row
  document.querySelectorAll(".art").forEach((el) => {
    const fit = () => {
      const w = el.naturalWidth || el.videoWidth, h = el.naturalHeight || el.videoHeight;
      if (w > h * 1.1) el.closest(".plate").classList.add("wide");
    };
    if (el.tagName === "VIDEO") el.addEventListener("loadedmetadata", fit, { once: true });
    else if (el.complete) fit(); else el.addEventListener("load", fit, { once: true });
  });
  $("#year").textContent = new Date().getFullYear();
}

function setupPlates() {
  const root = $("#series");
  root.addEventListener("click", (e) => {
    const p = e.target.closest(".plate");
    if (p && e.target.closest(".shot")) openReader(+p.dataset.s, +p.dataset.p);
  });
  // Cursor readout, like a measuring tool
  root.addEventListener("pointermove", (e) => {
    const el = e.target.closest(".art");
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    $(".xy", el.closest(".plate")).textContent = `x ${x.toFixed(2)} y ${y.toFixed(2)}`;
  });
  root.addEventListener("pointerout", (e) => {
    if (e.target.closest?.(".art")) $(".xy", e.target.closest(".plate")).textContent = "x —.— y —.—";
  });
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
    // land back on the page you stopped at
    document.querySelector(`.plate[data-s="${cur.s}"][data-p="${cur.p}"] .shot`)?.focus({ preventScroll: true });
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
setupPlates();
setupReader();
setupScrollReveal();
// The sections are built here, so jump to a #piece link once they exist
if (location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();

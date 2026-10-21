const ART = window.ART;
const $ = (s, el = document) => el.querySelector(s);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const pad = (n) => String(n).padStart(2, "0");
const full = (p) => `assets/art/${p}.webp`;
const thumb = (p) => `assets/art/thumbs/${p}.webp`;
const slug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "series";

function render() {
  $("#artIndex").innerHTML = ART.map((s, i) =>
    `<a href="#${slug(s.title)}"><span>${pad(i + 1)}</span> <bdi>${esc(s.title)}</bdi> <span>(${s.pages.length})</span></a>`).join("");

  $("#series").innerHTML = ART.map((s, si) => `
    <section class="section series reveal" id="${slug(s.title)}">
      <div class="section-head">
        <span class="label">${pad(si + 1)}</span><h2>${esc(s.title)}</h2>
        <span class="label meta">${esc(s.kind)} · ${s.pages.length} ${s.pages.length === 1 ? "page" : "pages"}</span>
      </div>
      ${s.note ? `<p class="lede">${esc(s.note)}</p>` : ""}
      <div class="pages">
        ${s.pages.map((p, pi) => `
          <button class="page" data-s="${si}" data-p="${pi}">
            <img src="${thumb(p)}" alt="${esc(s.title)}, page ${pi + 1}" loading="lazy">
            <span class="label">p.${pad(pi + 1)}</span>
          </button>`).join("")}
      </div>
    </section>`).join("");

  $("#year").textContent = new Date().getFullYear();
}

// ── Reader: full-screen, page by page ──
let cur = { s: 0, p: 0 };
function show() {
  const s = ART[cur.s];
  $("#rImg").src = full(s.pages[cur.p]);
  $("#rImg").alt = `${s.title}, page ${cur.p + 1}`;
  $("#rTitle").textContent = s.title;
  $("#rCount").textContent = `${pad(cur.p + 1)} / ${pad(s.pages.length)}`;
  $("#rPrev").disabled = cur.p === 0;
  $("#rNext").disabled = cur.p === s.pages.length - 1;
  // Warm the next page
  const next = s.pages[cur.p + 1];
  if (next) new Image().src = full(next);
}
const step = (d) => {
  const n = cur.p + d;
  if (n >= 0 && n < ART[cur.s].pages.length) { cur.p = n; show(); }
};
function setupReader() {
  const r = $("#reader");
  const close = () => { r.hidden = true; document.body.style.overflow = ""; };
  $("#series").addEventListener("click", (e) => {
    const b = e.target.closest(".page");
    if (!b) return;
    cur = { s: +b.dataset.s, p: +b.dataset.p };
    show();
    r.hidden = false;
    document.body.style.overflow = "hidden";
  });
  $("#rPrev").addEventListener("click", () => step(-1));
  $("#rNext").addEventListener("click", () => step(1));
  $("#rClose").addEventListener("click", close);
  r.addEventListener("click", (e) => { if (e.target === r) close(); });
  addEventListener("keydown", (e) => {
    if (r.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });
  let x0 = null;
  r.addEventListener("touchstart", (e) => (x0 = e.touches[0].clientX), { passive: true });
  r.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    x0 = null;
  });
}

function setupScrollReveal() {
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.05 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
}

render();
setupReader();
setupScrollReveal();

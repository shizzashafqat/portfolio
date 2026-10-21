const C = window.CONTENT;
const $ = (s, el = document) => el.querySelector(s);
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const lensAttr = (tags) => `data-lens-tags="${(tags || []).join(" ")}"`;
const linkChips = (links) => (links || []).map((l) => `<a class="chip" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join("");

// ── Hand-drawn scenes (inline SVG, inked with the wobble filter) ──
const INK = 'stroke="#141414" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';
const SCENES = {
  denison: (sky = "#7b3fe4") => `
    <svg viewBox="0 0 400 140" preserveAspectRatio="xMidYMax slice">
      <rect width="400" height="140" fill="${sky}"/>
      <circle cx="330" cy="34" r="16" fill="#ffd400" ${INK}/>
      <path d="M-10 140 Q80 70 200 92 T410 100 V150 H-10Z" fill="#2fbf4a" ${INK}/>
      <g ${INK} fill="#fff">
        <rect x="186" y="18" width="28" height="26"/><path d="M182 18 H218 L200 4Z" fill="#e8322b"/>
        <rect x="178" y="44" width="44" height="22"/>
        <path d="M150 82 L200 62 L250 82Z"/>
        <rect x="156" y="82" width="88" height="34"/>
        <path d="M168 84 V116 M184 84 V116 M200 84 V116 M216 84 V116 M232 84 V116"/>
        <rect x="194" y="26" width="12" height="12" fill="#141414"/>
      </g>
      <g ${INK} fill="#e8322b"><circle cx="70" cy="96" r="14"/><circle cx="330" cy="100" r="16"/></g>
      <path d="M70 110 V124 M330 116 V128" ${INK}/>
      <text x="40" y="40" font-family="Caveat" font-size="28" fill="#ffd400" stroke="#141414" stroke-width="1">1831</text>
    </svg>`,
  nyc: (sky = "#1ec8e8") => `
    <svg viewBox="0 0 400 140" preserveAspectRatio="xMidYMax slice">
      <rect width="400" height="140" fill="${sky}"/>
      <circle cx="60" cy="34" r="14" fill="#ffd400" ${INK}/>
      <g ${INK}>
        <rect x="20" y="78" width="40" height="62" fill="#ff8a1f"/>
        <rect x="62" y="60" width="34" height="80" fill="#fff"/>
        <path d="M110 140 V58 H118 V40 H124 V24 H128 V8 H130 V24 H134 V40 H140 V58 H148 V140Z" fill="#ffd400"/>
        <rect x="156" y="70" width="38" height="70" fill="#ff7ac8"/>
        <path d="M206 140 V54 Q206 30 220 22 Q234 30 234 54 V140Z" fill="#fff"/>
        <path d="M212 46 Q220 36 228 46 M210 56 Q220 44 230 56" fill="none"/>
        <path d="M220 22 V4" />
        <rect x="244" y="84" width="44" height="56" fill="#7b3fe4"/>
        <rect x="292" y="46" width="30" height="94" fill="#2fbf4a"/>
        <rect x="326" y="90" width="58" height="50" fill="#e8322b"/>
      </g>
      <g fill="#141414">
        <rect x="70" y="70" width="6" height="6"/><rect x="82" y="70" width="6" height="6"/>
        <rect x="70" y="86" width="6" height="6"/><rect x="82" y="102" width="6" height="6"/>
        <rect x="300" y="60" width="5" height="7"/><rect x="310" y="76" width="5" height="7"/>
        <rect x="300" y="92" width="5" height="7"/><rect x="164" y="82" width="6" height="6"/>
        <rect x="178" y="98" width="6" height="6"/>
      </g>
    </svg>`,
  seattle: (sky = "#ff7ac8") => `
    <svg viewBox="0 0 400 140" preserveAspectRatio="xMidYMax slice">
      <rect width="400" height="140" fill="${sky}"/>
      <path d="M220 140 L300 50 L330 76 L350 62 L420 140Z" fill="#fff" ${INK}/>
      <path d="M284 68 L300 50 L316 64 L306 70 L296 64Z" fill="#1ec8e8" ${INK}/>
      <g ${INK}>
        <path d="M150 140 L162 54 M190 140 L178 54" fill="none"/>
        <ellipse cx="170" cy="50" rx="34" ry="8" fill="#ffd400"/>
        <path d="M146 46 Q170 34 194 46" fill="#e8322b"/>
        <path d="M170 38 V14"/>
        <rect x="40" y="96" width="34" height="44" fill="#2fbf4a"/>
        <rect x="80" y="80" width="26" height="60" fill="#7b3fe4"/>
      </g>
      <path d="M-10 132 Q100 122 200 132 T410 130 V150 H-10Z" fill="#1ec8e8" ${INK}/>
    </svg>`,
  islamabad: (sky = "#ffd400") => `
    <svg viewBox="0 0 400 140" preserveAspectRatio="xMidYMax slice">
      <rect width="400" height="140" fill="${sky}"/>
      <path d="M-10 110 Q60 50 130 80 T260 66 T410 84 V150 H-10Z" fill="#2fbf4a" ${INK}/>
      <g ${INK}>
        <path d="M150 124 L200 64 L250 124Z" fill="#fff"/>
        <path d="M200 64 L200 124" fill="none"/>
        <rect x="130" y="54" width="6" height="70" fill="#fff"/><path d="M130 54 L133 40 L136 54Z" fill="#e8322b"/>
        <rect x="264" y="54" width="6" height="70" fill="#fff"/><path d="M264 54 L267 40 L270 54Z" fill="#e8322b"/>
      </g>
      <rect x="-10" y="124" width="420" height="20" fill="#ff8a1f" ${INK}/>
    </svg>`,
};

// ── Stickers you can drag around the hero ──
const STICKERS = [
  { x: 4, y: 18, svg: `<svg viewBox="0 0 100 100"><g ${INK}><rect x="22" y="30" width="56" height="48" rx="10" fill="#e8322b"/><rect x="32" y="42" width="36" height="18" rx="5" fill="#fff"/><circle cx="42" cy="51" r="4" fill="#141414"/><circle cx="58" cy="51" r="4" fill="#141414"/><path d="M50 30 V16"/><circle cx="50" cy="13" r="5" fill="#ffd400"/><path d="M40 68 Q50 74 60 68" fill="none"/></g></svg>` },
  { x: 44, y: 4, svg: `<svg viewBox="0 0 100 100"><g ${INK}><path d="M24 36 H70 V72 Q70 86 56 86 H38 Q24 86 24 72Z" fill="#1ec8e8"/><path d="M70 44 Q86 44 86 56 Q86 68 70 66" fill="none"/><path d="M38 24 Q34 16 40 10 M52 24 Q48 16 54 10" fill="none"/></g><text x="30" y="64" font-family="Caveat" font-weight="700" font-size="18" fill="#141414">coffee</text></svg>` },
  { x: 90, y: 14, svg: `<svg viewBox="0 0 100 100"><path ${INK} fill="#ffd400" d="M50 8 L61 38 L93 38 L67 57 L77 88 L50 69 L23 88 L33 57 L7 38 L39 38Z"/></svg>` },
  { x: 2, y: 78, svg: `<svg viewBox="0 0 100 100"><g ${INK}><rect x="16" y="22" width="68" height="56" rx="8" fill="#2fbf4a"/><path d="M16 36 H6 M16 52 H6 M16 66 H6 M84 36 H94 M84 52 H94 M84 66 H94 M36 22 V12 M50 22 V12 M64 22 V12 M36 78 V88 M50 78 V88 M64 78 V88"/></g><text x="30" y="60" font-family="Bricolage Grotesque" font-weight="800" font-size="26" fill="#fff" stroke="#141414" stroke-width="1.5">AI</text></svg>` },
  { x: 52, y: 86, svg: `<svg viewBox="0 0 100 100"><g ${INK}><path d="M50 12 Q76 12 76 40 Q76 56 62 64 V74 H38 V64 Q24 56 24 40 Q24 12 50 12Z" fill="#fff"/><path d="M40 82 H60 M42 90 H58"/><path d="M50 2 V-4 M84 20 L90 14 M16 20 L10 14" /></g><path d="M44 40 L50 52 L56 40" stroke="#ff8a1f" stroke-width="3" fill="none"/></svg>` },
];

// ── Render ──
function render() {
  // marquee
  const words = ["AI engineer", "✦", "software engineer", "✦", "product thinker", "✦", "artist", "✦", "Denison '27", "✦", "digital humanist", "✦"];
  $("#marquee").innerHTML = [...words, ...words].map((w) => `<span>${w}</span>`).join("");

  // journey
  $("#places").innerHTML = C.places.map((p) => `
    <article class="place reveal">
      <div class="scene">${(SCENES[p.scene] || SCENES.nyc)()}</div>
      <div class="body"><h3>${esc(p.city)}</h3><p>${esc(p.note)}</p></div>
    </article>`).join("");

  // experience
  $("#timeline").innerHTML = C.experience.map((j) => `
    <article class="job bg-${j.color} reveal" ${lensAttr(j.lens)}>
      <div class="meta">
        <span class="when">${esc(j.when)}</span>
        <div class="org">${esc(j.org)}</div>
        <div class="where">${esc(j.where)}</div>
      </div>
      <div>
        <div class="jobrole">${esc(j.role)}</div>
        <ul>${j.bullets.map((b) => `<li ${lensAttr(b.lens)}>${highlight(esc(b.text))}</li>`).join("")}</ul>
        ${j.links?.length ? `<div class="links">${linkChips(j.links)}</div>` : ""}
      </div>
    </article>`).join("");

  // projects
  $("#projectGrid").innerHTML = C.projects.map((p) => `
    <article class="project bg-${p.color} reveal" ${lensAttr(p.lens)}>
      <div class="top">
        <div class="kind">${esc(p.kind)}</div>
        <h3>${esc(p.title)}</h3>
      </div>
      ${p.stat ? `<div class="stat">${esc(p.stat)}</div>` : ""}
      ${p.image ? `<img class="shot" src="${esc(p.image)}" alt="${esc(p.title)} screenshot" loading="lazy">` : ""}
      <div class="inner">
        <p>${highlight(esc(p.blurb))}</p>
        <div class="stack">${p.stack.map((s) => `<span>${esc(s)}</span>`).join("")}</div>
        <div class="links">${p.links.length ? linkChips(p.links) : `<span class="soon">demo + pictures coming soon</span>`}</div>
      </div>
    </article>`).join("");

  // denison
  $("#denisonScene").innerHTML = SCENES.denison();
  $("#leadSummary").textContent = C.leadershipSummary;
  $("#roles").innerHTML = C.leadership.map((r) => `
    <article class="role reveal" ${lensAttr(r.lens)}><h3>${esc(r.title)}</h3><p>${esc(r.note)}</p></article>`).join("");
  const sk = C.skills;
  $("#skills").innerHTML = [["languages", sk.languages], ["frameworks", sk.frameworks], ["tools", sk.tools]]
    .map(([label, items]) => `<div class="row"><span class="label">${label}</span>${items.map((i) => `<span class="chip">${esc(i)}</span>`).join("")}</div>`).join("");

  // doodles + photos
  $("#gallery").innerHTML = C.doodles.map((d, i) => `
    <button class="doodle reveal" data-i="${i}">
      <img src="${esc(d.src)}" alt="${esc(d.title)}" loading="lazy">
      <h3>${esc(d.title)}</h3><p>${esc(d.note)}</p>
    </button>`).join("") + `<div class="doodle blank reveal"><span>next page<br>in progress ✎</span></div>`;
  $("#photos").innerHTML = C.photos.map((p) => `
    <figure class="reveal"><img src="${esc(p.src)}" alt="${esc(p.caption)}" loading="lazy"><figcaption>${esc(p.caption)}</figcaption></figure>`).join("");

  // contact
  $("#nycScene").innerHTML = SCENES.nyc();
  const links = [
    { label: "email me", href: `mailto:${C.email}`, cls: "c-red solid" },
    { label: "LinkedIn", href: C.linkedin, cls: "c-cyan solid" },
    { label: "GitHub", href: C.github, cls: "c-yellow solid" },
  ];
  if (C.resume) links.push({ label: "resume", href: C.resume, cls: "" });
  $("#contactLinks").innerHTML = links.map((l) => `<a class="chip ${l.cls}" href="${esc(l.href)}" target="_blank" rel="noopener">${l.label} ↗</a>`).join("");

  $("#year").textContent = new Date().getFullYear();
}

// Numbers pop with a marker highlight
function highlight(html) {
  return html.replace(/(\d[\d,.]*(?:[–-]\d+)?\s?(%|M\+|\+|K\+)?(\s?(hours|tokens|students|attendees|manual steps|departments|teammates|features|excavation reports))?)/g, "<mark>$1</mark>");
}

// ── Lens: AI / SWE / PM ──
function setupLens() {
  const buttons = document.querySelectorAll(".lens .chip");
  buttons.forEach((btn) => btn.addEventListener("click", () => {
    const lens = document.body.dataset.lens === btn.dataset.lens ? "all" : btn.dataset.lens;
    document.body.dataset.lens = lens;
    buttons.forEach((b) => b.setAttribute("aria-checked", String(b.dataset.lens === lens)));
    document.querySelectorAll("[data-lens-tags]").forEach((el) => {
      el.classList.toggle("match", lens !== "all" && el.dataset.lensTags.split(" ").includes(lens));
    });
    // Bring matching cards to the top of each list
    ["#timeline", "#projectGrid", "#roles"].forEach((sel) => {
      const parent = $(sel);
      const items = [...parent.children];
      items.sort((a, b) => (b.classList.contains("match") - a.classList.contains("match")) || (a._order - b._order));
      items.forEach((el) => parent.appendChild(el));
    });
    $("#intro").textContent = lens === "all"
      ? "I build AI, software, and products, and I draw all of it. Pick a lens above and the whole site rearranges itself around it."
      : C.intro[lens];
  }));
  ["#timeline", "#projectGrid", "#roles"].forEach((sel) => [...$(sel).children].forEach((el, i) => (el._order = i)));
}

// ── Draggable stickers ──
function setupStickers() {
  const layer = $("#stickers");
  STICKERS.forEach((s) => {
    const el = document.createElement("div");
    el.className = "sticker";
    el.innerHTML = s.svg;
    el.style.left = s.x + "%";
    el.style.top = s.y + "%";
    layer.appendChild(el);
    let ox = 0, oy = 0;
    el.addEventListener("pointerdown", (e) => {
      el.setPointerCapture(e.pointerId);
      el.classList.add("dragging");
      const r = el.getBoundingClientRect();
      ox = e.clientX - r.left; oy = e.clientY - r.top;
    });
    el.addEventListener("pointermove", (e) => {
      if (!el.classList.contains("dragging")) return;
      const box = layer.getBoundingClientRect();
      el.style.left = ((e.clientX - box.left - ox) / box.width) * 100 + "%";
      el.style.top = ((e.clientY - box.top - oy) / box.height) * 100 + "%";
    });
    el.addEventListener("pointerup", () => el.classList.remove("dragging"));
  });
}

// ── Hero doodle tilts toward the cursor ──
function setupTilt() {
  if (reduceMotion) return;
  const art = $("#heroArt"), img = $("#heroArt img");
  addEventListener("mousemove", (e) => {
    const x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
    art.style.transform = `rotate(-2deg) perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    img.style.transform = `scale(1.08) translate(${-x * 18}px, ${-y * 18}px)`;
  });
}

// ── Lightbox ──
function setupLightbox() {
  const lb = $("#lightbox");
  const close = () => (lb.hidden = true);
  $("#gallery").addEventListener("click", (e) => {
    const card = e.target.closest(".doodle[data-i]");
    if (!card) return;
    const d = C.doodles[card.dataset.i];
    $("img", lb).src = d.src; $("img", lb).alt = d.title;
    $("p", lb).textContent = `${d.title} · ${d.note}`;
    lb.hidden = false;
  });
  lb.addEventListener("click", (e) => { if (e.target === lb || e.target.closest(".lb-close")) close(); });
  addEventListener("keydown", (e) => e.key === "Escape" && close());
}

// ── Marker trail: the cursor leaves colorful ink that fades ──
function setupInk() {
  if (reduceMotion || matchMedia("(hover: none)").matches) return;
  const cv = $("#ink"), ctx = cv.getContext("2d");
  const colors = ["#e8322b", "#ffd400", "#7b3fe4", "#1ec8e8", "#2fbf4a", "#ff7ac8"];
  let pts = [], hue = 0;
  const size = () => { const d = devicePixelRatio || 1; cv.width = innerWidth * d; cv.height = innerHeight * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
  size(); addEventListener("resize", size);
  addEventListener("mousemove", (e) => {
    pts.push({ x: e.clientX, y: e.clientY, life: 1, c: colors[Math.floor(hue) % colors.length] });
    hue += 0.08;
    if (pts.length > 60) pts.shift();
  });
  (function draw() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i];
      ctx.strokeStyle = b.c; ctx.globalAlpha = b.life * 0.85;
      ctx.lineWidth = 6 * b.life;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
    pts.forEach((p) => (p.life -= 0.025));
    pts = pts.filter((p) => p.life > 0);
    requestAnimationFrame(draw);
  })();
}

// ── Hand-drawn "boil": nudge the wobble seed a few times a second ──
function setupBoil() {
  if (reduceMotion) return;
  const turb = document.querySelector("#wobble feTurbulence");
  let s = 1;
  setInterval(() => turb.setAttribute("seed", (s = (s % 3) + 1)), 180);
}

function setupReveal() {
  const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")), { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
}

render();
setupLens();
setupStickers();
setupTilt();
setupLightbox();
setupInk();
setupBoil();
setupReveal();

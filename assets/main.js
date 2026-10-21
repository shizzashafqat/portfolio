const C = window.CONTENT;
const $ = (s, el = document) => el.querySelector(s);
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const lensAttr = (tags) => `data-lens-tags="${(tags || []).join(" ")}"`;
const linkList = (links) => (links || []).map((l) => `<a href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join("");

const DEFAULT_INTRO = "I build AI, software, and products, and I draw all of it. Choose a lens below and the page refocuses on that role.";

// ── Line drawings: single-weight ink, no fill ──
const L = 'fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"';
const F = 'class="f" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"'; // filled with the page background, to hide lines behind
const SCENES = {
  denison: `
    <svg viewBox="0 0 400 140" preserveAspectRatio="xMidYMax meet">
      <path ${L} d="M0 128 Q90 96 200 108 T400 112"/>
      <circle ${L} cx="342" cy="30" r="11"/>
      <g>
        <path ${F} d="M182 20 H218 L200 6Z"/>
        <rect ${F} x="186" y="20" width="28" height="26"/>
        <rect ${L} x="195" y="27" width="10" height="12"/>
        <rect ${F} x="178" y="46" width="44" height="22"/>
        <path ${F} d="M146 84 L200 64 L254 84Z"/>
        <rect ${F} x="152" y="84" width="96" height="34"/>
        <path ${L} d="M166 88 V118 M182 88 V118 M200 88 V118 M218 88 V118 M234 88 V118"/>
      </g>
      <circle ${L} cx="72" cy="100" r="13"/><path ${L} d="M72 113 V124"/>
      <circle ${L} cx="320" cy="98" r="15"/><path ${L} d="M320 113 V122"/>
    </svg>`,
  nyc: `
    <svg viewBox="0 0 400 140" preserveAspectRatio="xMidYMax meet">
      <path ${L} d="M0 138 H400"/>
      <rect ${L} x="24" y="82" width="38" height="56"/>
      <rect ${L} x="66" y="62" width="32" height="76"/>
      <path ${L} d="M110 138 V60 H118 V42 H124 V26 H128 V8 H130 V26 H134 V42 H140 V60 H148 V138"/>
      <rect ${L} x="158" y="74" width="36" height="64"/>
      <path ${L} d="M206 138 V56 Q206 32 220 24 Q234 32 234 56 V138 M212 48 Q220 38 228 48 M210 58 Q220 46 230 58 M220 24 V6"/>
      <rect ${L} x="246" y="88" width="42" height="50"/>
      <rect ${L} x="294" y="50" width="28" height="88"/>
      <rect ${L} x="328" y="94" width="52" height="44"/>
      <path ${L} d="M74 74 h6 M86 74 h6 M74 90 h6 M86 106 h6 M302 64 v6 M312 80 v6 M302 96 v6"/>
    </svg>`,
  seattle: `
    <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMax meet">
      <path ${L} d="M210 196 L290 92 L318 120 L338 104 L410 196"/>
      <path ${L} d="M276 110 L290 92 L304 108"/>
      <path ${L} d="M150 196 L162 96 M190 196 L178 96"/>
      <ellipse ${F} cx="170" cy="92" rx="34" ry="8"/>
      <path ${L} d="M148 88 Q170 76 192 88 M170 80 V52"/>
      <rect ${L} x="40" y="150" width="30" height="46"/>
      <rect ${L} x="76" y="132" width="24" height="64"/>
      <path ${L} d="M0 196 H400"/>
    </svg>`,
  islamabad: `
    <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMax meet">
      <path ${L} d="M0 150 Q60 96 130 124 T260 108 T400 126"/>
      <path ${F} d="M150 184 L200 116 L250 184Z"/>
      <path ${L} d="M200 116 V184"/>
      <path ${L} d="M132 184 V104 L135 90 L138 104 V184 M262 184 V104 L265 90 L268 104 V184"/>
      <path ${L} d="M0 184 H400"/>
    </svg>`,
};
SCENES.granville = SCENES.denison;

function render() {
  $("#intro").textContent = DEFAULT_INTRO;

  $("#places").innerHTML = C.places.map((p) => `
    <article class="place reveal">
      <div class="scene">${(SCENES[p.scene] || SCENES.nyc).replace('viewBox="0 0 400 140"', 'viewBox="0 -60 400 200"')}</div>
      <h3>${esc(p.city)}</h3><p>${esc(p.note)}</p>
    </article>`).join("");

  $("#timeline").innerHTML = C.experience.map((j) => `
    <article class="job reveal" ${lensAttr(j.lens)}>
      <div>
        <div class="when">${esc(j.when)}</div>
        <div class="where">${esc(j.where)}</div>
      </div>
      <div>
        <div class="org">${esc(j.org)}</div>
        <div class="jobrole">${esc(j.role)}</div>
        <ul>${j.bullets.map((b) => `<li ${lensAttr(b.lens)}>${emphasize(esc(b.text))}</li>`).join("")}</ul>
        ${j.links?.length ? `<div class="links">${linkList(j.links)}</div>` : ""}
      </div>
    </article>`).join("");

  $("#projectGrid").innerHTML = C.projects.map((p) => `
    <article class="project reveal" ${lensAttr(p.lens)}>
      <div class="top"><span class="kind">${esc(p.kind)}</span>${p.stat ? `<span class="stat">${esc(p.stat)}</span>` : ""}</div>
      <h3>${esc(p.title)}</h3>
      ${p.image ? `<img class="shot" src="${esc(p.image)}" alt="${esc(p.title)} screenshot" loading="lazy">` : ""}
      <p>${emphasize(esc(p.blurb))}</p>
      <div class="stack">${p.stack.map((s) => `<span>${esc(s)}</span>`).join("")}</div>
      <div class="links">${p.links.length ? linkList(p.links) : `<span class="soon">Demo and images coming soon</span>`}</div>
    </article>`).join("");

  $("#denisonScene").innerHTML = SCENES.denison;
  $("#leadSummary").textContent = C.leadershipSummary;
  $("#roles").innerHTML = C.leadership.map((r) => `
    <article class="role reveal" ${lensAttr(r.lens)}><h3>${esc(r.title)}</h3><p>${esc(r.note)}</p></article>`).join("");
  const sk = C.skills;
  $("#skills").innerHTML = [["Languages", sk.languages], ["Frameworks", sk.frameworks], ["Tools", sk.tools]]
    .map(([label, items]) => `<div class="row"><span class="label">${label}</span><span class="items">${items.map(esc).join(", ")}</span></div>`).join("");

  $("#gallery").innerHTML = C.doodles.map((d, i) => `
    <button class="doodle reveal" data-i="${i}">
      <img src="${esc(d.src)}" alt="${esc(d.title)}" loading="lazy">
      <h3>${esc(d.title)}</h3><p>${esc(d.note)}</p>
    </button>`).join("") + `<div class="doodle blank reveal"><div class="ph"><span>next page, in progress</span></div></div>`;
  $("#photos").innerHTML = C.photos.map((p) => `
    <figure class="reveal"><img src="${esc(p.src)}" alt="${esc(p.caption)}" loading="lazy"><figcaption>${esc(p.caption)}</figcaption></figure>`).join("");

  $("#nycScene").innerHTML = SCENES.nyc;
  const links = [
    { label: "Email", href: `mailto:${C.email}` },
    { label: "LinkedIn", href: C.linkedin },
    { label: "GitHub", href: C.github },
  ];
  if (C.resume) links.push({ label: "Resume", href: C.resume });
  $("#contactLinks").innerHTML = links.map((l) => `<a href="${esc(l.href)}" target="_blank" rel="noopener">${l.label} ↗</a>`).join("");

  $("#year").textContent = new Date().getFullYear();
}

// Bold the numbers that carry the story
function emphasize(html) {
  return html.replace(/(\d[\d,.]*(?:[–-]\d+)?(?:%|M\+|K\+|\+)?)(?=[\s,.)]|$)/g, '<span class="num">$1</span>');
}

// ── Lens: AI / SWE / PM ──
const LISTS = ["#timeline", "#projectGrid", "#roles"];
function setupLens() {
  const buttons = document.querySelectorAll(".lens button");
  LISTS.forEach((sel) => [...$(sel).children].forEach((el, i) => (el._order = i)));
  buttons.forEach((btn) => btn.addEventListener("click", () => {
    const lens = btn.dataset.lens;
    document.body.dataset.lens = lens;
    buttons.forEach((b) => b.setAttribute("aria-checked", String(b === btn)));
    document.querySelectorAll("[data-lens-tags]").forEach((el) => {
      el.classList.toggle("match", lens !== "all" && el.dataset.lensTags.split(" ").includes(lens));
    });
    // Matching items move to the top of each list
    LISTS.forEach((sel) => {
      const parent = $(sel);
      [...parent.children]
        .sort((a, b) => (b.classList.contains("match") - a.classList.contains("match")) || (a._order - b._order))
        .forEach((el) => parent.appendChild(el));
    });
    const intro = $("#intro");
    intro.style.opacity = 0;
    setTimeout(() => { intro.textContent = lens === "all" ? DEFAULT_INTRO : C.intro[lens]; intro.style.opacity = 1; }, 200);
  }));
}

// ── Hero: the grayscale doodle colors in under the cursor ──
function setupReveal() {
  const art = $("#heroArt");
  let r = 0, target = 0;
  const move = (x, y) => {
    const b = art.getBoundingClientRect();
    art.style.setProperty("--x", x - b.left + "px");
    art.style.setProperty("--y", y - b.top + "px");
  };
  art.addEventListener("pointerenter", () => (target = 120));
  art.addEventListener("pointerleave", () => (target = 0));
  art.addEventListener("pointermove", (e) => move(e.clientX, e.clientY));
  (function tick() {
    r += (target - r) * (reduceMotion ? 1 : 0.12);
    art.style.setProperty("--r", r.toFixed(1) + "px");
    requestAnimationFrame(tick);
  })();
}

function setupLightbox() {
  const lb = $("#lightbox");
  const close = () => (lb.hidden = true);
  $("#gallery").addEventListener("click", (e) => {
    const card = e.target.closest(".doodle[data-i]");
    if (!card) return;
    const d = C.doodles[card.dataset.i];
    $("img", lb).src = d.src; $("img", lb).alt = d.title;
    $("p", lb).textContent = `${d.title}. ${d.note}`;
    lb.hidden = false;
  });
  lb.addEventListener("click", (e) => { if (e.target === lb || e.target.closest(".lb-close")) close(); });
  addEventListener("keydown", (e) => e.key === "Escape" && close());
}

// Slight, slow tremble in the line drawings, like animation paper
function setupBoil() {
  if (reduceMotion) return;
  const turb = $("#wobble feTurbulence");
  let s = 1;
  setInterval(() => turb.setAttribute("seed", (s = (s % 3) + 1)), 260);
}

function setupScrollReveal() {
  const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")), { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
}

render();
setupLens();
setupReveal();
setupLightbox();
setupBoil();
setupScrollReveal();

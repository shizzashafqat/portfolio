const C = window.CONTENT;
const $ = (s, el = document) => el.querySelector(s);
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const lensAttr = (tags) => `data-lens-tags="${(tags || []).join(" ")}"`;
const linkList = (links) => (links || []).map((l) => `<a href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join("");
const pad = (n) => String(n).padStart(2, "0");

const DEFAULT_INTRO = "I build AI, software, and products, and I draw all of it. Set a lens below and the page refocuses on that role.";

// ── Line drawings ──
// Every stroke has pathLength=1 so CSS can "draw" it in when it scrolls into view.
const L = 'class="ln" pathLength="1" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"';
const F = 'pathLength="1" class="f ln" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"'; // background-filled, hides lines behind
const svg = (vb, body, ar = "xMidYMax meet") => `<svg class="line" viewBox="${vb}" preserveAspectRatio="${ar}" aria-hidden="true">${body}</svg>`;

const SCENES = {
  denison: (vb = "0 0 400 140") => svg(vb, `
    <path ${L} d="M0 128 Q90 96 200 108 T400 112"/>
    <circle ${L} cx="342" cy="30" r="11"/>
    <path ${F} d="M182 20 H218 L200 6Z"/>
    <rect ${F} x="186" y="20" width="28" height="26"/>
    <rect ${L} x="195" y="27" width="10" height="12"/>
    <rect ${F} x="178" y="46" width="44" height="22"/>
    <path ${F} d="M146 84 L200 64 L254 84Z"/>
    <rect ${F} x="152" y="84" width="96" height="34"/>
    <path ${L} d="M166 88 V118 M182 88 V118 M200 88 V118 M218 88 V118 M234 88 V118"/>
    <circle ${L} cx="72" cy="100" r="13"/><path ${L} d="M72 113 V124"/>
    <circle ${L} cx="320" cy="98" r="15"/><path ${L} d="M320 113 V122"/>`),
  nyc: (vb = "0 0 400 140") => svg(vb, `
    <path ${L} d="M0 138 H400"/>
    <rect ${L} x="24" y="82" width="38" height="56"/>
    <rect ${L} x="66" y="62" width="32" height="76"/>
    <path ${L} d="M110 138 V60 H118 V42 H124 V26 H128 V8 H130 V26 H134 V42 H140 V60 H148 V138"/>
    <rect ${L} x="158" y="74" width="36" height="64"/>
    <path ${L} d="M206 138 V56 Q206 32 220 24 Q234 32 234 56 V138 M212 48 Q220 38 228 48 M210 58 Q220 46 230 58 M220 24 V6"/>
    <rect ${L} x="246" y="88" width="42" height="50"/>
    <rect ${L} x="294" y="50" width="28" height="88"/>
    <rect ${L} x="328" y="94" width="52" height="44"/>
    <path ${L} d="M74 74 h6 M86 74 h6 M74 90 h6 M86 106 h6 M302 64 v6 M312 80 v6 M302 96 v6"/>`),
  seattle: () => svg("0 0 400 200", `
    <path ${L} d="M210 196 L290 92 L318 120 L338 104 L410 196"/>
    <path ${L} d="M276 110 L290 92 L304 108"/>
    <path ${L} d="M150 196 L162 96 M190 196 L178 96"/>
    <ellipse ${F} cx="170" cy="92" rx="34" ry="8"/>
    <path ${L} d="M148 88 Q170 76 192 88 M170 80 V52"/>
    <rect ${L} x="40" y="150" width="30" height="46"/>
    <rect ${L} x="76" y="132" width="24" height="64"/>
    <path ${L} d="M0 196 H400"/>`),
  islamabad: () => svg("0 0 400 200", `
    <path ${L} d="M0 150 Q60 96 130 124 T260 108 T400 126"/>
    <path ${F} d="M150 184 L200 116 L250 184Z"/>
    <path ${L} d="M200 116 V184"/>
    <path ${L} d="M132 184 V104 L135 90 L138 104 V184 M262 184 V104 L265 90 L268 104 V184"/>
    <path ${L} d="M0 184 H400"/>`),
};

// A long New York skyline for the top of the page: landmarks plus seeded filler towers
function skyline() {
  const W = 1200, G = 150;
  let seed = 7;
  const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  const parts = [`<path ${L} d="M0 ${G} H${W}"/>`];
  const landmarks = {
    250: `<path ${L} d="M232 ${G} V70 H240 V50 H246 V32 H250 V8 H252 V32 H256 V50 H262 V70 H270 V${G}"/>
          <path ${L} d="M240 84 V140 M251 84 V140 M262 84 V140"/>`,
    520: `<path ${L} d="M504 ${G} V60 Q504 34 520 26 Q536 34 536 60 V${G} M510 52 Q520 40 530 52 M508 62 Q520 48 532 62 M520 26 V4"/>`,
    820: `<path ${L} d="M800 ${G} V40 L812 24 H828 L840 40 V${G} M820 24 V0"/>`,
    1040: `<path ${L} d="M1010 ${G} V120 H1070 V${G} M1018 120 Q1040 96 1062 120"/>
           <path ${L} d="M960 ${G} Q1000 110 1040 ${G} M1040 ${G} Q1090 110 1140 ${G}" opacity=".6"/>`,
  };
  let x = 8;
  while (x < W - 30) {
    const lm = Object.keys(landmarks).map(Number).find((k) => x <= k + 30 && x + 40 >= k - 40);
    if (lm !== undefined) { parts.push(landmarks[lm]); delete landmarks[lm]; x = lm + 52; continue; }
    const w = 22 + Math.round(rnd() * 30), h = 30 + Math.round(rnd() * 70);
    parts.push(`<rect ${L} x="${x}" y="${G - h}" width="${w}" height="${h}"/>`);
    if (rnd() > 0.55) parts.push(`<path ${L} d="M${x + 6} ${G - h + 10} h6 M${x + 6} ${G - h + 22} h6"/>`);
    x += w + 4 + Math.round(rnd() * 8);
  }
  return svg(`0 0 ${W} ${G + 2}`, parts.join(""), "xMidYMax meet");
}

// One animal per project, same single-line style
const ANIMALS = {
  owl: () => svg("0 0 200 200", `
    <path ${L} d="M30 172 H170"/>
    <path ${L} d="M72 170 C54 140 54 86 78 62 L70 36 L92 52 Q100 48 108 52 L130 36 L122 62 C146 86 146 140 128 170 Z"/>
    <circle ${L} cx="86" cy="82" r="14"/><circle ${L} cx="114" cy="82" r="14"/>
    <circle ${L} cx="88" cy="84" r="4"/><circle ${L} cx="112" cy="84" r="4"/>
    <path ${L} d="M95 98 L100 108 L105 98"/>
    <path ${L} d="M68 112 Q82 136 78 162 M132 112 Q118 136 122 162"/>
    <path ${L} d="M92 124 l4 4 l4 -4 l4 4 l4 -4 M96 138 l4 4 l4 -4"/>
    <path ${L} d="M88 170 v6 M94 170 v6 M106 170 v6 M112 170 v6"/>`, "xMidYMid meet"),
  elephant: () => svg("0 0 200 200", `
    <path ${L} d="M20 156 H184"/>
    <path ${L} d="M60 72 Q72 58 94 62 Q132 50 160 66 Q180 78 176 112 L176 154 L162 154 L160 124 Q134 132 110 126 L108 154 L94 154 L92 122 Q82 118 74 114 Q68 132 62 146 Q56 158 46 152 Q42 146 50 140 Q56 126 54 108 Q46 84 60 72 Z"/>
    <path ${L} d="M150 128 V154 H140 V130"/>
    <path ${L} d="M86 70 Q108 70 106 96 Q104 116 86 110"/>
    <circle ${L} cx="70" cy="84" r="1.8"/>
    <path ${L} d="M62 108 Q68 120 80 117"/>
    <path ${L} d="M176 84 Q186 92 184 106"/>`, "xMidYMid meet"),
  bee: () => svg("0 0 200 200", `
    <g opacity=".45">
      <path ${L} d="M132 30 l12 -7 l12 7 v14 l-12 7 l-12 -7 Z"/>
      <path ${L} d="M156 30 l12 -7 l12 7 v14 l-12 7 l-12 -7 Z"/>
      <path ${L} d="M144 51 l12 -7 l12 7 v14 l-12 7 l-12 -7 Z"/>
      <path ${L} d="M22 150 l12 -7 l12 7 v14 l-12 7 l-12 -7 Z"/>
      <path ${L} d="M46 150 l12 -7 l12 7 v14 l-12 7 l-12 -7 Z"/>
    </g>
    <ellipse ${L} cx="112" cy="112" rx="40" ry="26"/>
    <path ${L} d="M100 87 Q92 112 100 137 M120 86 Q112 112 120 138 M138 92 Q132 112 138 132"/>
    <circle ${L} cx="64" cy="108" r="16"/>
    <circle ${L} cx="58" cy="104" r="1.8"/>
    <path ${L} d="M58 93 Q52 76 42 74 M68 92 Q70 76 64 66"/>
    <path ${L} d="M151 108 L164 112 L151 117"/>
    <path ${L} d="M104 88 Q86 52 108 46 Q128 48 116 87 M122 88 Q132 56 152 60 Q164 72 132 92"/>
    <path ${L} d="M96 137 l-4 10 M112 138 l-2 10 M128 136 l2 10"/>`, "xMidYMid meet"),
  penguins: () => {
    const one = `
      <path ${L} d="M66 62 Q46 64 44 100 Q40 146 52 166 L82 166 Q94 146 90 100 Q87 64 66 62 Z"/>
      <path ${L} d="M70 88 Q58 102 60 136 Q62 160 70 162 Q80 160 81 136 Q82 102 70 88 Z"/>
      <circle ${L} cx="74" cy="76" r="1.8"/>
      <path ${L} d="M86 78 L96 82 L86 86"/>
      <path ${L} d="M48 106 Q36 126 42 142"/>
      <path ${L} d="M56 166 l-4 6 M78 166 l4 6"/>`;
    return svg("0 0 200 200", `
      <path ${L} d="M20 172 H180"/>
      <path ${L} d="M100 44 C94 36 84 42 92 50 L100 58 L108 50 C116 42 106 36 100 44 Z"/>
      <g>${one}</g><g transform="translate(200 0) scale(-1 1)">${one}</g>`, "xMidYMid meet");
  },
};

function render() {
  $("#intro").textContent = DEFAULT_INTRO;
  $("#skyline").innerHTML = skyline();

  $("#places").innerHTML = C.places.map((p, i) => `
    <article class="place reveal">
      <div class="scene draw">${(SCENES[p.scene] || SCENES.nyc)("0 -60 400 200")}</div>
      <span class="label">${pad(i + 1)} / ${pad(C.places.length)}</span>
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

  $("#projectGrid").innerHTML = C.projects.map((p, i) => `
    <article class="spotlight reveal" ${lensAttr(p.lens)}>
      <div class="animal-wrap">
        <div class="animal frame draw">${(ANIMALS[p.animal] || ANIMALS.owl)()}</div>
        <div class="animal-cap label"><span>fig.${pad(i + 1)} · ${esc(p.animal || "")}</span><span class="note">${esc(p.animalNote || "")}</span></div>
      </div>
      <div class="sp-body">
        <div class="idx label"><span>${pad(i + 1)} / ${pad(C.projects.length)}</span><span>${esc(p.kind)}</span></div>
        <h3>${esc(p.title)}</h3>
        ${p.image ? `<img class="shot" src="${esc(p.image)}" alt="${esc(p.title)} screenshot" loading="lazy">` : ""}
        <p>${emphasize(esc(p.blurb))}</p>
        ${p.stat ? `<div class="metric"><span class="label">key metric</span><b>${esc(p.stat)}</b></div>` : ""}
        <div class="stack">${p.stack.map((s) => `<span>${esc(s)}</span>`).join("")}</div>
        <div class="links">${p.links.length ? linkList(p.links) : `<span class="soon">// demo + images coming soon</span>`}</div>
      </div>
    </article>`).join("");

  $("#denisonScene").innerHTML = SCENES.denison();
  $("#leadSummary").textContent = C.leadershipSummary;
  $("#roles").innerHTML = C.leadership.map((r) => `
    <article class="role reveal" ${lensAttr(r.lens)}><h3>${esc(r.title)}</h3><p>${esc(r.note)}</p></article>`).join("");
  const sk = C.skills;
  $("#skills").innerHTML = [["languages", sk.languages], ["frameworks", sk.frameworks], ["tools", sk.tools]]
    .map(([label, items]) => `<div class="row"><span class="label">${label}:</span><span class="items">[${items.map((i) => `"${esc(i)}"`).join(", ")}]</span></div>`).join("");

  $("#gallery").innerHTML = C.doodles.map((d, i) => `
    <button class="doodle reveal" data-i="${i}">
      <img src="${esc(d.src)}" alt="${esc(d.title)}" loading="lazy">
      <h3>${esc(d.title)}</h3><p>${esc(d.note)}</p>
    </button>`).join("") + `<div class="doodle blank reveal"><div class="ph"><span class="label">// next page, in progress</span></div></div>`;
  $("#photos").innerHTML = C.photos.map((p) => `
    <figure class="reveal"><img src="${esc(p.src)}" alt="${esc(p.caption)}" loading="lazy"><figcaption class="label">${esc(p.caption)}</figcaption></figure>`).join("");

  const links = [
    { label: "email", href: `mailto:${C.email}` },
    { label: "linkedin", href: C.linkedin },
    { label: "github", href: C.github },
  ];
  if (C.resume) links.push({ label: "resume.pdf", href: C.resume });
  $("#contactLinks").innerHTML = links.map((l) => `<a href="${esc(l.href)}" target="_blank" rel="noopener">${l.label} ↗</a>`).join("");

  $("#year").textContent = new Date().getFullYear();
}

// Set the numbers that carry the story in mono
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
function setupColorReveal() {
  const art = $("#heroArt");
  let r = 0, target = 0;
  art.addEventListener("pointerenter", () => (target = 120));
  art.addEventListener("pointerleave", () => (target = 0));
  art.addEventListener("pointermove", (e) => {
    const b = art.getBoundingClientRect();
    art.style.setProperty("--x", e.clientX - b.left + "px");
    art.style.setProperty("--y", e.clientY - b.top + "px");
  });
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

// Local time in Granville, OH
function setupClock() {
  const el = $("#clock");
  const fmt = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZoneName: "short" });
  const tick = () => (el.textContent = `granville, oh · ${fmt.format(new Date())}`);
  tick(); setInterval(tick, 1000);
}

function setupScrollReveal() {
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: 0.15 });
  document.querySelectorAll(".reveal, .draw").forEach((el) => io.observe(el));
}

render();
setupLens();
setupColorReveal();
setupLightbox();
setupClock();
setupScrollReveal();

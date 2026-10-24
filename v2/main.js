const C = window.CONTENT;
const $ = (s, el = document) => el.querySelector(s);
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const lensAttr = (tags) => `data-lens-tags="${(tags || []).join(" ")}"`;
const linkList = (links) => (links || []).map((l) => `<a href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join("");
const pad = (n) => String(n).padStart(2, "0");
const slug = (t) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

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

// Project visual: app screens, photos/video, or an empty "no image" box
function visual(p) {
  const shots = p.screens || [];
  const media = p.media || [];
  if (shots.length) {
    return `
      <div class="vis phones frame">
        ${shots.map((sc, k) => `
          <button class="phone screen" style="--k:${k};--n:${shots.length}" data-src="${esc(sc.src)}" data-cap="${esc(sc.caption)}">
            <img src="${esc(sc.src)}" alt="${esc(p.title)}: ${esc(sc.caption)}" loading="lazy">
            <span class="tag mono">${pad(k + 1)}</span>
          </button>`).join("")}
      </div>
      <ol class="vis-cap">${shots.map((sc, k) => `<li class="label"><b>${pad(k + 1)}</b> ${esc(sc.caption)}</li>`).join("")}</ol>`;
  }
  if (media.length) {
    return `
      <div class="vis stack-media frame">
        ${media.map((m, k) => `
          <figure class="m ${m.type}">
            ${m.type === "video"
              ? `<video poster="${esc(m.poster || "")}" controls playsinline preload="none">
                  ${m.webm ? `<source src="${esc(m.webm)}" type="video/webm">` : ""}
                  <source src="${esc(m.src)}" type="video/mp4">
                </video>`
              : `<button class="screen" data-src="${esc(m.src)}" data-cap="${esc(m.caption)}"><img src="${esc(m.src)}" alt="${esc(m.caption)}" loading="lazy"></button>`}
            <span class="tag mono">${pad(k + 1)}${m.type === "video" ? " ▸" : ""}</span>
          </figure>`).join("")}
      </div>
      <ol class="vis-cap">${media.map((m, k) => `<li class="label"><b>${pad(k + 1)}</b> ${esc(m.caption)}</li>`).join("")}</ol>`;
  }
  return `
      <div class="vis empty frame" role="img" aria-label="No image yet">
        <svg viewBox="0 0 100 75" preserveAspectRatio="none" aria-hidden="true"><path d="M0 0 L100 75 M100 0 L0 75"/></svg>
        <span class="mono">no image</span>
      </div>
      <ol class="vis-cap"><li class="label">images coming soon</li></ol>`;
}

function render() {
  const A = C.about;
  $("#about").innerHTML = [
    ["year", A.year], ["studying", A.study], ["school", A.school], ["gpa", A.gpa],
    ["courses", A.courses.join(" · ")],
  ].map(([k, v]) => `<div><dt>${k}:</dt><dd>${esc(v)}</dd></div>`).join("");
  $("#roleButtons").innerHTML = C.roles.map((r) => `
    <button role="radio" aria-checked="false" data-lens="${r.lens}">${esc(r.label)}</button>`).join("");
  $("#skyline").innerHTML = skyline();

  $("#timeline").innerHTML = C.experience.map((j) => `
    <article class="job reveal" ${lensAttr(j.lens)}>
      <div>
        <div class="when">${esc(j.when)}</div>
        <div class="where">${esc(j.where)}</div>
      </div>
      <div>
        <div class="org">${esc(j.org)}</div>
        <div class="jobrole">${esc(j.role)}</div>
        <p class="summary">${emphasize(esc(j.summary))}</p>
        <div class="impact">${j.impact.map((x) => `<span>${emphasize(esc(x))}</span>`).join("")}</div>
        <details>
          <summary class="label">details</summary>
          <ul>${j.bullets.map((b) => `<li ${lensAttr(b.lens)}>${emphasize(esc(b.text))}</li>`).join("")}</ul>
        </details>
        ${j.links?.length ? `<div class="links">${linkList(j.links)}</div>` : ""}
      </div>
    </article>`).join("");

  $("#projectGrid").innerHTML = C.projects.map((p, i) => `
    <article class="spotlight reveal" id="p-${slug(p.title)}" ${lensAttr(p.lens)}>
      <div class="vis-wrap">${visual(p)}</div>
      <div class="sp-body">
        <div class="idx label"><span>${pad(i + 1)} / ${pad(C.projects.length)}</span><span>${esc(p.kind)}</span></div>
        <h3>${esc(p.title)}</h3>
        <p>${emphasize(esc(p.blurb))}</p>
        ${p.stat ? `<div class="metric"><span class="label">key metric</span><b>${esc(p.stat)}</b></div>` : ""}
        <div class="stack">${p.stack.map((s) => `<span>${esc(s)}</span>`).join("")}</div>
        ${p.links.length ? `<div class="links">${linkList(p.links)}</div>` : ""}
      </div>
    </article>`).join("");

  $("#denisonScene").innerHTML = SCENES.denison();
  $("#leadSummary").textContent = C.leadershipSummary;
  $("#roles").innerHTML = C.leadership.map((r) => `
    <article class="role reveal" ${lensAttr(r.lens)}><h3>${esc(r.title)}</h3><p>${esc(r.note)}</p></article>`).join("");
  const sk = C.skills;
  $("#skills").innerHTML = [["languages", sk.languages], ["frameworks", sk.frameworks], ["tools", sk.tools]]
    .map(([label, items]) => `<div class="row"><span class="label">${label}:</span><span class="items">[${items.map((i) => `"${esc(i)}"`).join(", ")}]</span></div>`).join("");

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

// ── Roles: pick one to see the projects for it ──
const LISTS = ["#timeline", "#projectGrid", "#roles"];
function setupLens() {
  const box = $("#roleButtons");
  const buttons = box.querySelectorAll("button");
  LISTS.forEach((sel) => [...$(sel).children].forEach((el, i) => (el._order = i)));
  const apply = (lens) => {
    document.body.dataset.lens = lens;
    buttons.forEach((b) => b.setAttribute("aria-checked", String(b.dataset.lens === lens)));
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
    const role = C.roles.find((r) => r.lens === lens);
    const projects = role ? C.projects.filter((p) => p.lens.includes(lens)) : [];
    $("#rolePanel").innerHTML = role ? `
      <p>${esc(role.intro)}</p>
      <ol>${projects.map((p) => `<li><a href="v2/index.html#p-${slug(p.title)}"><span class="label">${esc(p.kind)}</span><b>${esc(p.title)}</b><i aria-hidden="true">→</i></a></li>`).join("")}</ol>` : "";
  };
  buttons.forEach((btn) => btn.addEventListener("click", () =>
    apply(btn.getAttribute("aria-checked") === "true" ? "all" : btn.dataset.lens)));
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
  const open = (src, alt, text) => {
    $("img", lb).src = src; $("img", lb).alt = alt;
    $("p", lb).textContent = text;
    lb.hidden = false;
  };
  $("#projectGrid").addEventListener("click", (e) => {
    const sc = e.target.closest(".screen");
    if (sc) open(sc.dataset.src, sc.dataset.cap, sc.dataset.cap);
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

// ─────────────────────────────────────────────────────────────
//  v2 · the code-editor portfolio.
//
//  All the words, projects and pictures come from ../assets/content.js and
//  ../assets/art.js, the same files the classic site reads, so editing those
//  updates both designs. This file only decides how it all looks.
//
//  Styling is Tailwind. After changing classes here, rebuild tailwind.css
//  (the command is at the top of tailwind.config.js).
// ─────────────────────────────────────────────────────────────

const { useState, useEffect, useRef, useCallback } = React;
const html = htm.bind(React.createElement);
const C = window.CONTENT;
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// content.js paths are written from the site root; v2 lives one folder down
const u = (p) => (/^(https?:|mailto:|#|\.\.\/)/.test(p) ? p : "../" + p);
const pad = (n) => String(n).padStart(2, "0");
const slug = (t) => t.toLowerCase().replace(/\./g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "x";
const hash7 = (s) => {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return (h >>> 0).toString(16).padStart(8, "0").slice(0, 7);
};
const LENS = { ds: "data science", swe: "software engineering", pm: "product management" };

const TABS = [
  { id: "home", file: "01_home.tsx" },
  { id: "projects", file: "02_projects.tsx" },
  { id: "artwork", file: "03_artwork.tsx" },
  { id: "denison", file: "04_at_denison.tsx" },
  { id: "contact", file: "05_contact.tsx" },
  { id: "resume", file: "06_resume.pdf" },
];

// "#projects/hot-wheels-garage" → { tab: "projects", sub: "hot-wheels-garage" }
function parseHash() {
  const [tab, sub] = decodeURIComponent(location.hash.slice(1)).split("/");
  return { tab: TABS.some((t) => t.id === tab) ? tab : "home", sub: sub || "" };
}

// Every art series, plus the doodles, as one list of pieces with full paths
const ART = [
  ...window.ART.map((s) => ({
    title: s.title, kind: s.kind, caption: s.caption, slug: slug(s.title),
    pages: s.pages.map((p) => (typeof p === "string" ? { file: p } : p)).map((p) => ({
      full: u(`assets/art/${p.file}.webp`),
      thumb: u(`assets/art/thumbs/${p.file}.webp`),
      video: p.video ? u(`assets/art/${p.file}.mp4`) : "",
      caption: p.caption || "",
    })),
  })),
  ...C.doodles.map((d) => ({
    title: d.title, kind: "digital doodle · procreate", caption: d.note, slug: slug(d.title),
    pages: [{ full: u(d.src), thumb: u(d.src), video: "", caption: "" }],
  })),
];

// ── Small pieces of syntax ──
const K = ({ children }) => html`<span className="text-accent">${children}</span>`;
const S = ({ children }) => html`<span className="text-[#cfc7b3]">"${children}"</span>`;
const P = ({ children }) => html`<span className="text-dim">${children}</span>`;
const Cm = ({ children }) => html`<span className="italic text-dim">${"// "}${children}</span>`;

// A code block, one line at a time; i is the indent level
const Code = ({ children }) => html`<div className="overflow-x-auto p-4 text-[13px] leading-7 sm:p-5 sm:text-sm">${children}</div>`;
const Ln = ({ i = 0, children }) => html`<div className="whitespace-nowrap" style=${{ paddingLeft: i * 2 + "ch" }}>${children}</div>`;

// Numbers that carry the story get the accent color
const NUM = /(\d[\d,.]*(?:[–-]\d+)?(?:%|M\+|K\+|\+)?)(?=[\s,.)]|$)/g;
function emph(text) {
  const out = [];
  let last = 0;
  text.replace(NUM, (m, _g, off) => {
    out.push(text.slice(last, off), html`<span key=${off} className="text-accent">${m}</span>`);
    last = off + m.length;
  });
  out.push(text.slice(last));
  return out;
}

const ExtLink = ({ href, children }) => html`
  <a href=${u(href)} target=${href.startsWith("#") ? null : "_blank"} rel="noopener"
     className="text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent">${children}</a>`;

function Head({ title, children }) {
  return html`
    <header className="mb-10">
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">${title}</h2>
      ${children ? html`<p className="mt-4 max-w-2xl leading-relaxed text-dim">${children}</p>` : null}
    </header>`;
}

// ── 01 · home ──

// Types like a person: a playful typo, a wipe, self-corrections, then a loop of who I am
const IDENTITIES = [
  "an aspiring software engineer.",
  "an aspiring data scientist.",
  "an aspiring product manager.",
  "a digital artist & builder.",
  "a cs student at denison.",
];
const FINAL = "shizza is a senior cs student at denison, graduating may 2027.";

function useTypewriter() {
  const [text, setText] = useState(reduceMotion ? FINAL : "");
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    if (reduceMotion) return;
    let alive = true, cur = "";
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const set = (t) => { cur = t; if (alive) setText(t); };
    const key = (ch) => 45 + Math.random() * 75 + (ch === " " ? 40 : 0) + (/[.,]/.test(ch) ? 160 : 0);
    const type = async (s) => {
      setTyping(true);
      for (const ch of s) { if (!alive) return; set(cur + ch); await sleep(key(ch)); }
      setTyping(false);
    };
    const back = async (n, ms = 30) => {
      setTyping(true);
      for (let i = 0; i < n; i++) { if (!alive) return; set(cur.slice(0, -1)); await sleep(ms); }
      setTyping(false);
    };
    const backTo = (prefix) => back(cur.length - prefix.length, 22);
    (async () => {
      await sleep(700);
      await type("welcme to shizza's website...");
      await sleep(1100); await back(cur.length, 16); await sleep(500);
      await type("shizza is a senoor");
      await sleep(450); await back(3, 90); await type("ior cs student at denison, fradsu");
      await sleep(420); await back(6, 80); await type("graduating may 2027.");
      await sleep(2400); await backTo("shizza is a "); await sleep(300);
      await type("cs student."); await sleep(1600);
      for (let i = 0; alive; i = (i + 1) % IDENTITIES.length) {
        await backTo("shizza is "); await sleep(260);
        await type(IDENTITIES[i]); await sleep(2000);
      }
    })();
    return () => { alive = false; };
  }, []);
  return [text, typing];
}

function Typewriter() {
  const [text, typing] = useTypewriter();
  const lead = "shizza is ";
  const split = text.startsWith(lead);
  return html`
    <p className="mt-3 min-h-[3.9em] text-[1.65rem] font-medium leading-[1.3] sm:text-4xl xl:text-5xl" >
      <span className="sr-only">${FINAL} Aspiring software engineer, data scientist and product manager, and a digital artist.</span>
      <span aria-hidden="true">
        <span className="text-accent">${"> "}</span>
        ${split ? html`${lead}<span className="text-accent">${text.slice(lead.length)}</span>` : text}
        <span className=${"ml-1 inline-block h-[0.95em] w-[0.5em] translate-y-[0.12em] bg-accent " + (typing ? "" : "caret-blink")}></span>
      </span>
    </p>`;
}

// The Swasey Chapel doodle starts in grayscale. Wherever the cursor goes, color
// is painted in and stays, until the whole drawing is in color.
const DOODLE = u(C.doodles[0].src);
const BRUSH = 64; // in image pixels

function Doodle() {
  const wrap = useRef(null), canvas = useRef(null), ring = useRef(null);
  const st = useRef({ img: null, mask: null, last: null, frame: 0, dirty: false });
  const [pct, setPct] = useState(0);

  const draw = useCallback(() => {
    const s = st.current;
    s.frame = 0;
    if (!s.img) return;
    const ctx = canvas.current.getContext("2d");
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
    ctx.drawImage(s.img, 0, 0);
    ctx.globalCompositeOperation = "destination-in";
    ctx.drawImage(s.mask, 0, 0);
  }, []);
  const schedule = () => { if (!st.current.frame) st.current.frame = requestAnimationFrame(draw); };

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const mask = document.createElement("canvas");
      mask.width = canvas.current.width = img.naturalWidth;
      mask.height = canvas.current.height = img.naturalHeight;
      Object.assign(st.current, { img, mask });
      draw();
    };
    img.src = DOODLE;
    // How much is colored in, sampled small
    const probe = document.createElement("canvas");
    probe.width = 80; probe.height = 62;
    const id = setInterval(() => {
      const s = st.current;
      if (!s.mask || !s.dirty) return;
      s.dirty = false;
      const p = probe.getContext("2d", { willReadFrequently: true });
      p.clearRect(0, 0, 80, 62);
      p.drawImage(s.mask, 0, 0, 80, 62);
      const a = p.getImageData(0, 0, 80, 62).data;
      let on = 0;
      for (let i = 3; i < a.length; i += 4) if (a[i] > 140) on++;
      setPct(Math.round((on / (a.length / 4)) * 100));
    }, 250);
    return () => clearInterval(id);
  }, [draw]);

  const dab = (x, y) => {
    const m = st.current.mask.getContext("2d");
    const g = m.createRadialGradient(x, y, 0, x, y, BRUSH);
    g.addColorStop(0, "rgba(0,0,0,1)");
    g.addColorStop(0.55, "rgba(0,0,0,.85)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    m.fillStyle = g;
    m.fillRect(x - BRUSH, y - BRUSH, BRUSH * 2, BRUSH * 2);
  };

  const onMove = (e) => {
    const s = st.current;
    const r = wrap.current.getBoundingClientRect();
    const cx = e.clientX - r.left, cy = e.clientY - r.top;
    const scale = r.width / (s.img?.naturalWidth || r.width);
    ring.current.style.transform = `translate(${cx}px, ${cy}px)`;
    ring.current.style.width = ring.current.style.height = BRUSH * 1.3 * scale + "px";
    ring.current.style.opacity = 1;
    if (!s.mask || (e.pointerType === "touch" && !e.buttons)) return;
    const x = cx / scale, y = cy / scale;
    // Fill the gap from the last point so fast strokes stay continuous
    const from = s.last || { x, y };
    const steps = Math.max(1, Math.ceil(Math.hypot(x - from.x, y - from.y) / (BRUSH / 4)));
    for (let i = 1; i <= steps; i++) dab(from.x + ((x - from.x) * i) / steps, from.y + ((y - from.y) * i) / steps);
    s.last = { x, y };
    s.dirty = true;
    schedule();
  };
  const onLeave = () => { st.current.last = null; ring.current.style.opacity = 0; };

  const fill = (on) => {
    const s = st.current;
    if (!s.mask) return;
    const m = s.mask.getContext("2d");
    m.clearRect(0, 0, s.mask.width, s.mask.height);
    if (on) { m.fillStyle = "#000"; m.fillRect(0, 0, s.mask.width, s.mask.height); }
    s.dirty = true;
    schedule();
  };

  return html`
    <figure className="w-full">
      <div className="flex items-center justify-between gap-3 border border-b-0 border-line bg-panel px-3 py-2 text-xs text-dim">
        <span className="truncate">doodles/<span className="text-fg">swasey-chapel.jpg</span></span>
        <span className="shrink-0 tabular-nums">colored <span className="text-accent">${pct}%</span></span>
      </div>
      <div ref=${wrap} onPointerMove=${onMove} onPointerDown=${onMove} onPointerLeave=${onLeave} onPointerUp=${(e) => e.pointerType === "touch" && onLeave()}
           className="relative cursor-crosshair touch-none select-none overflow-hidden border border-line bg-white">
        <img src=${DOODLE} alt="Shizza's doodle of Denison's Swasey Chapel surrounded by AI, data, coffee, music, and campus icons"
             className="block h-auto w-full opacity-90 contrast-125 grayscale" draggable="false" />
        <canvas ref=${canvas} aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full"></canvas>
        <span ref=${ring} aria-hidden="true"
              className="pointer-events-none absolute -left-0 -top-0 -ml-[1px] rounded-full border border-accent opacity-0 transition-opacity [translate:-50%_-50%]"></span>
      </div>
      <figcaption className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs text-dim">
        <span>${pct >= 97 ? "// fully colored. thank you ✓" : "// hover (or drag) to color it in"}</span>
        <span className="flex gap-2">
          <button onClick=${() => fill(true)} className="border border-line px-2 py-1 hover:border-accent hover:text-fg">color all</button>
          <button onClick=${() => fill(false)} className="border border-line px-2 py-1 hover:border-accent hover:text-fg">reset</button>
        </span>
      </figcaption>
    </figure>`;
}

function AboutCode() {
  const A = C.about;
  const rows = [["year", A.year], ["studying", A.study], ["school", A.school], ["gpa", A.gpa]];
  return html`
    <div className="border border-line bg-panel">
      <p className="border-b border-line px-4 py-2 text-xs text-dim">about.ts</p>
      <${Code}>
        <${Ln}><${K}>const</${K}> shizza = ${"{"}</${Ln}>
        ${rows.map(([k, v]) => html`<${Ln} key=${k} i=${1}><${P}>${k}</${P}>: <${S}>${v}</${S}>,</${Ln}>`)}
        <${Ln} i=${1}><${P}>courses</${P}>: [</${Ln}>
        ${A.courses.map((c) => html`<${Ln} key=${c} i=${2}><${S}>${c}</${S}>,</${Ln}>`)}
        <${Ln} i=${1}>],</${Ln}>
        <${Ln} i=${1}><${P}>email</${P}>: <${S}>${C.email}</${S}>,</${Ln}>
        <${Ln}>${"};"}</${Ln}>
      </${Code}>
    </div>`;
}

function RolePicker() {
  const [lens, setLens] = useState("");
  const role = C.roles.find((r) => r.lens === lens);
  const projects = role ? C.projects.filter((p) => p.lens.includes(lens)) : [];
  return html`
    <div className="border border-line bg-panel">
      <p className="border-b border-line px-4 py-2 text-xs text-dim">roles.ts</p>
      <div className="p-4 sm:p-5">
        <p className="text-sm"><${Cm}>interested in · pick a role to see the projects for it</${Cm}></p>
        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Roles">
          ${C.roles.map((r) => html`
            <button key=${r.lens} aria-pressed=${lens === r.lens} onClick=${() => setLens(lens === r.lens ? "" : r.lens)}
              className=${"border px-3 py-1.5 text-sm transition-colors " + (lens === r.lens ? "border-accent bg-accent text-ink" : "border-line text-dim hover:border-accent hover:text-fg")}>
              ${r.label}
            </button>`)}
        </div>
        <div aria-live="polite">
          ${role ? html`
            <p key="intro" className="mt-5 text-sm leading-relaxed">${role.intro}</p>
            <ol key="list" className="mt-4 divide-y divide-line border-y border-line">
              ${projects.map((p) => html`
                <li key=${p.title}>
                  <a href=${"#projects/" + slug(p.title)} className="group flex items-baseline gap-3 py-2.5 text-sm hover:text-accent">
                    <span className="text-dim">→</span><b className="font-medium">${p.title}</b>
                    <span className="ml-auto hidden truncate text-xs text-dim sm:inline">${p.kind}</span>
                  </a>
                </li>`)}
            </ol>` : null}
        </div>
      </div>
    </div>`;
}

function GitLog() {
  return html`
    <section className="mt-20">
      <${Head} title="Work">Where I've shipped things, newest first.<//>
      <ol className="relative ml-1.5 border-l border-line">
        ${C.experience.map((j, i) => html`
          <li key=${j.role} className="relative pb-12 pl-7 last:pb-0 sm:pl-10">
            <span className=${"absolute -left-[6px] top-1.5 h-[11px] w-[11px] rounded-full border-2 " + (i === 0 ? "border-accent bg-accent" : "border-accent bg-ink")}></span>
            <p className="text-xs text-dim">
              <span className="text-accent">commit ${hash7(j.role + j.when)}</span>
              ${i === 0 ? html`<span className="ml-2 text-fg">(HEAD → main)</span>` : null}
            </p>
            <p className="mt-1 text-xs text-dim">${j.when} · ${j.where}</p>
            <h3 className="mt-3 text-lg font-bold leading-snug sm:text-xl">${j.role}</h3>
            <p className="text-sm text-dim">@ ${j.org}</p>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed">${emph(j.summary)}</p>
            <div className="mt-4 max-w-3xl border border-line bg-panel text-sm">
              ${j.impact.map((x) => html`<p key=${x} className="border-l-2 border-accent bg-accent/[0.06] px-3 py-1"><span className="text-accent">+ </span>${x}</p>`)}
            </div>
            <details className="group mt-3 max-w-3xl text-sm">
              <summary className="text-dim hover:text-fg"><span className="inline-block transition-transform group-open:rotate-90">›</span> more details</summary>
              <ul className="mt-2 space-y-2 border-l border-line pl-4 text-dim">
                ${j.bullets.map((b) => html`<li key=${b.text} className="leading-relaxed">${emph(b.text)}</li>`)}
              </ul>
            </details>
            ${j.links.length ? html`<p className="mt-3 flex gap-4 text-sm">${j.links.map((l) => html`<${ExtLink} key=${l.href} href=${l.href}>${l.label} ↗</${ExtLink}>`)}</p>` : null}
          </li>`)}
      </ol>
    </section>`;
}

function Home() {
  return html`
    <div>
      <section className="grid items-center gap-10 lg:min-h-[calc(100vh-142px)] lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] xl:gap-14">
        <div>
          <h1 className="text-sm sm:text-base"><${K}>const</${K}> name = <${S}>${C.name}</${S}>;</h1>
          <${Typewriter} />
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <a href="#projects" className="bg-accent px-4 py-2 font-medium text-ink hover:bg-fg">open projects →</a>
            <a href="#artwork" className="border border-line px-4 py-2 hover:border-accent">see artwork</a>
            <a href="#resume" className="border border-line px-4 py-2 hover:border-accent">resume.pdf</a>
          </div>
        </div>
        <${Doodle} />
      </section>

      <section className="mt-20 grid gap-6 lg:grid-cols-2">
        <${AboutCode} />
        <${RolePicker} />
      </section>

      <${GitLog} />
    </div>`;
}

// ── 02 · projects ──

function Visual({ p, openLb }) {
  const shots = p.screens || [], media = p.media || [];
  if (shots.length) {
    const items = shots.map((s) => ({ src: u(s.src), caption: s.caption, title: p.title }));
    return html`
      <div>
        <div className="grid grid-cols-4 gap-2">
          ${shots.map((s, k) => html`
            <button key=${s.src} onClick=${() => openLb(items, k)} aria-label=${"Open " + s.caption}
                    className="group relative overflow-hidden rounded-[10px] border border-line bg-ink">
              <img src=${u(s.src)} alt=${p.title + ": " + s.caption} loading="lazy"
                   className="aspect-[9/19.5] w-full object-cover object-top transition-opacity group-hover:opacity-80" />
              <span className="absolute left-1 top-1 bg-ink/85 px-1 text-[10px] text-accent">${pad(k + 1)}</span>
            </button>`)}
        </div>
        <ol className="mt-3 space-y-1 text-xs text-dim">
          ${shots.map((s, k) => html`<li key=${s.src}><span className="text-accent">${pad(k + 1)}</span> ${s.caption}</li>`)}
        </ol>
      </div>`;
  }
  if (media.length) {
    const imgs = media.filter((m) => m.type !== "video");
    const items = imgs.map((m) => ({ src: u(m.src), caption: m.caption, title: p.title }));
    return html`
      <div className="space-y-3">
        ${media.filter((m) => m.type === "video").map((m) => html`
          <figure key=${m.src}>
            <video className="aspect-video w-full border border-line bg-black object-cover" poster=${u(m.poster || "")} controls playsInline preload="none">
              ${m.webm ? html`<source src=${u(m.webm)} type="video/webm" />` : null}
              <source src=${u(m.src)} type="video/mp4" />
            </video>
            <figcaption className="mt-1.5 text-xs text-dim"><span className="text-accent">▸</span> ${m.caption}</figcaption>
          </figure>`)}
        <div className=${imgs.length > 1 ? "grid grid-cols-2 gap-3" : ""}>
          ${imgs.map((m, k) => html`
            <figure key=${m.src}>
              <button onClick=${() => openLb(items, k)} className="block w-full overflow-hidden border border-line bg-ink" aria-label=${"Open " + m.caption}>
                <img src=${u(m.src)} alt=${m.caption} loading="lazy" className="w-full transition-opacity hover:opacity-80" />
              </button>
              <figcaption className="mt-1.5 text-xs text-dim">${m.caption}</figcaption>
            </figure>`)}
        </div>
      </div>`;
  }
  return html`
    <div className="relative grid aspect-video place-items-center border border-dashed border-line text-sm text-dim" role="img" aria-label="No image yet">
      <svg viewBox="0 0 100 56" preserveAspectRatio="none" aria-hidden="true" className="absolute inset-0 h-full w-full stroke-line">
        <path d="M0 0 L100 56 M100 0 L0 56" vectorEffect="non-scaling-stroke" />
      </svg>
      <span className="relative bg-panel px-2">${"// TODO: screenshots"}</span>
    </div>`;
}

function ProjectCard({ p, i, openLb }) {
  const s = slug(p.title);
  const [before, after] = (p.stat || "").split(/\s*→\s*/);
  return html`
    <article id=${"p-" + s} className="scroll-mt-20 border border-line bg-panel">
      <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-2 text-xs text-dim">
        <span className="truncate">projects/${s}/<span className="text-fg">README.md</span></span>
        <span className="shrink-0 tabular-nums">${pad(i + 1)} / ${pad(C.projects.length)}</span>
      </div>
      <div className="grid xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="border-b border-line p-4 sm:p-5 xl:border-b-0 xl:border-r"><${Visual} p=${p} openLb=${openLb} /></div>
        <div className="p-5 sm:p-6">
          <p className="text-xs text-dim">${"> " + p.kind}</p>
          <h3 className="mt-2 text-xl font-bold sm:text-2xl"><span className="text-accent"># </span>${p.title}</h3>
          <p className="mt-4 text-sm leading-relaxed">${emph(p.blurb)}</p>
          ${p.stat ? html`
            <div className="mt-5 border border-line bg-ink text-sm">
              <p className="border-b border-line bg-raised px-3 py-1 text-xs text-dim">@@ key metric @@</p>
              ${after ? html`<p className="px-3 py-1 text-dim">- <span className="line-through decoration-faint">${before}</span></p>` : null}
              <p className="border-l-2 border-accent bg-accent/[0.08] px-3 py-1 text-accent">+ ${after || before}</p>
            </div>` : null}
          <p className="mt-4 text-sm leading-relaxed"><${K}>import</${K}> ${"{ "}<span className="text-fg">${p.stack.join(", ")}</span>${" }"} <${K}>from</${K}> <${S}>stack</${S}>;</p>
          ${p.links.length ? html`<p className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">${p.links.map((l) => html`<${ExtLink} key=${l.href} href=${l.href}>${l.label} ↗</${ExtLink}>`)}</p>` : null}
        </div>
      </div>
    </article>`;
}

function Projects({ openLb }) {
  const [lens, setLens] = useState("all");
  const list = C.projects.filter((p) => lens === "all" || p.lens.includes(lens));
  const chip = (id, label) => html`
    <button key=${id} aria-pressed=${lens === id} onClick=${() => setLens(id)}
      className=${"border px-3 py-1 transition-colors " + (lens === id ? "border-accent bg-accent text-ink" : "border-line text-dim hover:border-accent hover:text-fg")}>${label}</button>`;
  return html`
    <div>
      <${Head} title="Projects">Software, research, and the things in between.<//>
      <div className="mb-8 flex flex-wrap items-center gap-2 text-sm">
        <span className="mr-1 text-dim">--filter=</span>
        ${chip("all", "all")}${Object.entries(LENS).map(([id, label]) => chip(id, label))}
      </div>
      <div className="grid gap-10 xl:grid-cols-[190px_minmax(0,1fr)]">
        <nav aria-label="Project files" className="hidden self-start text-sm xl:sticky xl:top-20 xl:block">
          <p>▾ projects/</p>
          <ul className="mt-1 border-l border-line">
            ${list.map((p) => html`
              <li key=${p.title}><a href=${"#projects/" + slug(p.title)} className="block truncate py-1 pl-3 text-dim hover:text-accent">${slug(p.title)}/</a></li>`)}
          </ul>
        </nav>
        <div className="space-y-12">
          ${list.map((p) => html`<${ProjectCard} key=${p.title} p=${p} i=${C.projects.indexOf(p)} openLb=${openLb} />`)}
        </div>
      </div>
    </div>`;
}

// ── 03 · artwork ──

function Artwork({ openLb }) {
  const total = ART.reduce((n, s) => n + s.pages.length, 0);
  return html`
    <div>
      <${Head} title="Art & doodles">Ink and marker comics about family, home, and the places in between, plus digital doodles. Click any page to open it.<//>
      <nav aria-label="Pieces" className="max-w-3xl border border-line bg-panel p-4 text-xs sm:text-sm">
        <p className="mb-2 text-dim">total ${total}</p>
        ${ART.map((s) => html`
          <a key=${s.slug} href=${"#artwork/" + s.slug} className="grid grid-cols-[3ch_minmax(0,1fr)] gap-x-4 py-0.5 hover:text-accent sm:grid-cols-[3ch_22ch_minmax(0,1fr)]">
            <span className="tabular-nums text-dim">${pad(s.pages.length)}</span>
            <span className="hidden truncate text-dim sm:inline">${s.kind}</span>
            <span className="truncate"><bdi>${s.title}</bdi>/</span>
          </a>`)}
      </nav>
      ${ART.map((s, si) => {
        const items = s.pages.map((pg, pi) => ({
          src: pg.full, video: pg.video, title: s.title,
          caption: [s.caption, pg.caption].filter(Boolean).join("  ·  ") || s.kind,
          count: `${pad(pi + 1)} / ${pad(s.pages.length)}`,
        }));
        const cols = s.pages.length === 1 ? "max-w-xl" : s.pages.length === 2 ? "columns-2 max-w-4xl" : "columns-2 md:columns-3 xl:columns-4";
        return html`
          <section key=${s.slug} id=${"a-" + s.slug} className="mt-20 scroll-mt-20">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-line pb-3">
              <span className="text-sm text-accent">${pad(si + 1)}</span>
              <h3 className="text-xl font-bold sm:text-2xl"><bdi>${s.title}</bdi></h3>
              <span className="text-xs text-dim">${s.kind} · ${s.pages.length} ${s.pages.length === 1 ? "piece" : "pages"}</span>
            </div>
            ${s.caption ? html`<p className="mt-3 max-w-2xl text-sm leading-relaxed text-dim">${"// " + s.caption}</p>` : null}
            <div className=${"mt-6 gap-4 " + cols}>
              ${s.pages.map((pg, pi) => html`
                <button key=${pg.full} onClick=${() => openLb(items, pi)} aria-label=${`Open ${s.title}, page ${pi + 1}`}
                        className="group mb-5 block w-full break-inside-avoid text-left">
                  <span className="relative block overflow-hidden border border-line bg-raised">
                    <img src=${pg.thumb} alt=${`${s.title}, page ${pi + 1}`} loading="lazy" decoding="async"
                         className="h-auto w-full transition-transform duration-300 group-hover:scale-[1.03]" />
                    ${pg.video ? html`<span className="absolute bottom-2 left-2 bg-ink/85 px-1.5 py-0.5 text-[11px] text-accent">▸ clip</span>` : null}
                  </span>
                  ${pg.caption ? html`<span className="mt-1.5 block text-xs leading-relaxed text-dim">${pg.caption}</span>` : null}
                </button>`)}
            </div>
          </section>`;
      })}
    </div>`;
}

// ── 04 · at denison ──

function Chapel() {
  const L = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinejoin: "round", strokeLinecap: "round" };
  const F = { ...L, fill: "#0e0e0d" };
  return html`
    <svg viewBox="0 0 400 140" aria-hidden="true" className="h-auto w-full text-accent">
      <path ...${L} d="M0 128 Q90 96 200 108 T400 112" />
      <circle ...${L} cx="342" cy="30" r="11" />
      <path ...${F} d="M182 20 H218 L200 6Z" />
      <rect ...${F} x="186" y="20" width="28" height="26" />
      <rect ...${L} x="195" y="27" width="10" height="12" />
      <rect ...${F} x="178" y="46" width="44" height="22" />
      <path ...${F} d="M146 84 L200 64 L254 84Z" />
      <rect ...${F} x="152" y="84" width="96" height="34" />
      <path ...${L} d="M166 88 V118 M182 88 V118 M200 88 V118 M218 88 V118 M234 88 V118" />
      <circle ...${L} cx="72" cy="100" r="13" /><path ...${L} d="M72 113 V124" />
      <circle ...${L} cx="320" cy="98" r="15" /><path ...${L} d="M320 113 V122" />
    </svg>`;
}

function Denison() {
  const A = C.about;
  const campusJobs = C.experience.filter((j) => j.org === "Denison University");
  const sk = C.skills;
  return html`
    <div>
      <${Head} title="At Denison">Granville, Ohio. Where I study computer science and digital humanities, help run a club, coach peers, and build AI tools for campus.<//>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="border border-line bg-panel">
          <p className="border-b border-line px-4 py-2 text-xs text-dim">student.json</p>
          <${Code}>
            <${Ln}>${"{"}</${Ln}>
            ${[["status", A.year], ["major", A.study.split(" · ")[0]], ["minor", (A.study.split(" · ")[1] || "").replace(/^minor in /, "")],
               ["school", A.school], ["gpa", A.gpa], ["graduating", "may 2027"]].map(([k, v], i, all) => html`
              <${Ln} key=${k} i=${1}><${P}>"${k}"</${P}>: <${S}>${v}</${S}>${i < all.length - 1 ? "," : ""}</${Ln}>`)}
            <${Ln}>${"}"}</${Ln}>
          </${Code}>
        </div>
        <div className="flex flex-col justify-between gap-6 border border-line bg-panel p-5">
          <${Chapel} />
          <div className="grid grid-cols-2 gap-4">
            ${C.leadershipSummary.split(" · ").map((x) => html`
              <p key=${x} className="text-sm leading-snug text-dim">${emph(x)}</p>`)}
          </div>
        </div>
      </section>

      <section className="mt-16">
        <h3 className="text-sm text-dim"><span className="text-accent">##</span> leadership, teaching & coaching</h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          ${C.leadership.map((r) => html`
            <article key=${r.title} className="border border-line bg-panel p-5 transition-colors hover:border-accent">
              <h4 className="text-lg font-bold leading-snug">${r.title}</h4>
              <p className="mt-2 text-sm text-dim">${r.note}</p>
              <p className="mt-4 text-xs text-accent">[${r.lens.map((l) => LENS[l]).join(", ")}]</p>
            </article>`)}
        </div>
      </section>

      <section className="mt-16">
        <h3 className="text-sm text-dim"><span className="text-accent">##</span> on-campus jobs</h3>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          ${campusJobs.map((j) => html`
            <article key=${j.role} className="border border-line bg-panel p-5">
              <p className="text-xs text-dim">${j.when}</p>
              <h4 className="mt-2 font-bold leading-snug">${j.role}</h4>
              <p className="mt-3 text-sm leading-relaxed text-dim">${emph(j.summary)}</p>
            </article>`)}
        </div>
      </section>

      <section className="mt-16">
        <h3 className="text-sm text-dim"><span className="text-accent">##</span> coursework & toolbox</h3>
        <div className="mt-5 space-y-3 border border-line bg-panel p-5 text-sm leading-relaxed">
          ${[["courses", A.courses], ["languages", sk.languages], ["frameworks", sk.frameworks], ["tools", sk.tools]].map(([k, items]) => html`
            <p key=${k}><${P}>${k}</${P}>: [${items.map((x, i) => html`<span key=${x}><${S}>${x}</${S}>${i < items.length - 1 ? ", " : ""}</span>`)}]</p>`)}
        </div>
      </section>
    </div>`;
}

// ── 05 · contact ──

function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = () => navigator.clipboard?.writeText(C.email).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1600); });
  const rows = [
    ["email", C.email, `mailto:${C.email}`],
    ["linkedin", C.linkedin.replace(/^https?:\/\//, ""), C.linkedin],
    ["github", C.github.replace(/^https?:\/\//, ""), C.github],
    ["resume", "06_resume.pdf", "#resume"],
  ];
  return html`
    <div className="flex min-h-[60vh] flex-col justify-center">
      <h2 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl">Let's build<br />something<span className="text-accent">.</span></h2>
      <p className="mt-5 max-w-xl leading-relaxed text-dim">Open to data science, software engineering, and product roles for 2027.</p>
      <div className="mt-10 max-w-2xl border border-line bg-panel text-sm">
        ${rows.map(([k, label, href]) => html`
          <div key=${k} className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-line px-4 py-3 last:border-b-0">
            <span className="w-20 text-dim">${k}</span>
            <a href=${href} target=${href.startsWith("#") || href.startsWith("mailto") ? null : "_blank"} rel="noopener" className="min-w-0 break-all hover:text-accent">${label} <span className="text-accent">↗</span></a>
            ${k === "email" ? html`<button onClick=${copy} className="ml-auto border border-line px-2 py-0.5 text-xs text-dim hover:border-accent hover:text-fg">${copied ? "copied ✓" : "copy"}</button>` : null}
          </div>`)}
      </div>
      <p className="mt-6 text-xs text-dim">${"// based in granville, oh · usually replies within a day"}</p>
    </div>`;
}

// ── 06 · resume ──
// Built from content.js, so it's always current. If a PDF is set in
// content.js (`resume`), a download button links to it too.

function Resume() {
  const A = C.about;
  const H = ({ children }) => html`<h3 className="mt-6 border-b border-neutral-300 pb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-500">${children}</h3>`;
  return html`
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3 border border-line bg-panel px-4 py-2 text-xs text-dim">
        <span className="text-fg">06_resume.pdf</span><span>· 1 page</span>
        <span className="ml-auto flex gap-2">
          ${C.resume ? html`<a href=${u(C.resume)} download className="border border-line px-2 py-1 hover:border-accent hover:text-fg">download pdf</a>` : null}
          <button onClick=${() => print()} className="bg-accent px-2 py-1 font-medium text-ink hover:bg-fg">print / save as pdf</button>
        </span>
      </div>
      <div className="overflow-x-auto bg-raised p-3 sm:p-8">
        <article id="paper" className="mx-auto max-w-[820px] bg-[#fbfaf7] px-6 py-8 text-[12.5px] leading-relaxed text-neutral-900 shadow-2xl sm:px-12 sm:py-12">
          <h2 className="text-2xl font-bold tracking-tight">${C.name}</h2>
          <p className="mt-1 text-neutral-600">${C.email} · ${C.linkedin.replace(/^https?:\/\//, "")} · ${C.github.replace(/^https?:\/\//, "")}</p>

          <${H}>education</${H}>
          <div className="mt-2 flex flex-wrap justify-between gap-x-4"><b>Denison University</b><span className="text-neutral-600">Granville, OH · May 2027</span></div>
          <p>B.S. ${A.study.replace(/^computer science \(b\.s\.\)/, "Computer Science")} · GPA ${A.gpa}</p>
          <p className="text-neutral-600">Courses: ${A.courses.join(", ")}</p>

          <${H}>experience</${H}>
          ${C.experience.map((j) => html`
            <div key=${j.role} className="mt-3">
              <div className="flex flex-wrap justify-between gap-x-4"><b>${j.role}</b><span className="text-neutral-600">${j.when}</span></div>
              <p className="text-neutral-600">${j.org} · ${j.where}</p>
              <ul className="mt-1 list-disc space-y-0.5 pl-5">${j.bullets.map((b) => html`<li key=${b.text}>${b.text}</li>`)}</ul>
            </div>`)}

          <${H}>projects</${H}>
          ${C.projects.map((p) => html`
            <p key=${p.title} className="mt-2"><b>${p.title}</b> <span className="text-neutral-600">· ${p.stack.join(", ")}</span><br />${p.blurb.split(/(?<=\.)\s/)[0]}</p>`)}

          <${H}>leadership</${H}>
          <ul className="mt-2 list-disc space-y-0.5 pl-5">
            ${C.leadership.map((r) => html`<li key=${r.title}><b>${r.title}</b>: ${r.note}</li>`)}
            <li>${C.leadershipSummary}</li>
          </ul>

          <${H}>skills</${H}>
          <p className="mt-2"><b>Languages:</b> ${C.skills.languages.join(", ")}</p>
          <p><b>Frameworks:</b> ${C.skills.frameworks.join(", ")}</p>
          <p><b>Tools:</b> ${C.skills.tools.join(", ")}</p>
        </article>
      </div>
    </div>`;
}

// ── Lightbox, shared by projects and artwork ──

function Lightbox({ lb, setLb }) {
  const closeBtn = useRef(null);
  const back = useRef(null);
  const { items, i } = lb;
  const it = items[i];
  const go = useCallback((d) => setLb((s) => ({ ...s, i: Math.min(s.items.length - 1, Math.max(0, s.i + d)) })), [setLb]);
  const close = useCallback(() => setLb(null), [setLb]);

  useEffect(() => {
    back.current = document.activeElement;
    closeBtn.current?.focus();
    document.body.style.overflow = "hidden";
    const key = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    addEventListener("keydown", key);
    return () => { removeEventListener("keydown", key); document.body.style.overflow = ""; back.current?.focus?.({ preventScroll: true }); };
  }, [close, go]);

  useEffect(() => { const n = items[i + 1]; if (n && !n.video) new Image().src = n.src; }, [items, i]);

  const x0 = useRef(null);
  return html`
    <div role="dialog" aria-modal="true" aria-label=${it.title} className="fixed inset-0 z-50 flex flex-col bg-[#080808]"
         onClick=${(e) => e.target === e.currentTarget && close()}
         onTouchStart=${(e) => (x0.current = e.touches[0].clientX)}
         onTouchEnd=${(e) => { if (x0.current === null) return; const dx = e.changedTouches[0].clientX - x0.current; if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1); x0.current = null; }}>
      <div className="flex items-center gap-4 border-b border-line bg-ink px-4 py-2.5 text-xs text-dim">
        <span className="truncate text-fg"><bdi>${it.title}</bdi></span>
        ${items.length > 1 ? html`<span className="tabular-nums">${pad(i + 1)} / ${pad(items.length)}</span>` : null}
        <button ref=${closeBtn} onClick=${close} className="ml-auto border border-line px-2 py-1 hover:border-accent hover:text-fg">[esc] close</button>
      </div>
      <div className="relative flex min-h-0 flex-1 items-center justify-center p-3 sm:p-8" onClick=${(e) => e.target === e.currentTarget && close()}>
        <div key=${it.src} className="tab-open relative max-h-full overflow-hidden">
          ${it.video
            ? html`<video src=${it.video} poster=${it.src} autoPlay loop muted playsInline controls className="block max-h-[calc(100vh-170px)] max-w-full"></video>`
            : html`<img src=${it.src} alt=${it.caption} className="block max-h-[calc(100vh-170px)] max-w-full object-contain" />`}
          <span className="grain" aria-hidden="true"></span>
        </div>
        ${items.length > 1 ? html`
          <button key="prev" onClick=${() => go(-1)} disabled=${i === 0} aria-label="Previous"
                  className="absolute left-2 top-1/2 -translate-y-1/2 border border-line bg-ink/80 px-3 py-2 text-dim hover:border-accent hover:text-fg disabled:opacity-30 sm:left-6">←</button>
          <button key="next" onClick=${() => go(1)} disabled=${i === items.length - 1} aria-label="Next"
                  className="absolute right-2 top-1/2 -translate-y-1/2 border border-line bg-ink/80 px-3 py-2 text-dim hover:border-accent hover:text-fg disabled:opacity-30 sm:right-6">→</button>` : null}
      </div>
      <p className="border-t border-line bg-ink px-4 py-3 text-center text-xs leading-relaxed text-dim sm:text-sm">${"// " + it.caption}</p>
    </div>`;
}

// ── Editor chrome ──

function TabBar({ tab }) {
  const active = useRef(null);
  useEffect(() => { active.current?.scrollIntoView({ block: "nearest", inline: "nearest" }); }, [tab]);
  return html`
    <header className="fixed inset-x-0 top-0 z-40 bg-ink">
      <div className="flex h-11 border-b border-line">
        <a href="#home" aria-label="Home" className="hidden shrink-0 items-center border-r border-line px-4 font-bold text-accent sm:flex">s<span className="caret-blink">_</span></a>
        <nav aria-label="Files" className="no-scrollbar flex min-w-0 flex-1 overflow-x-auto">
          ${TABS.map((t) => html`
            <a key=${t.id} href=${"#" + t.id} ref=${t.id === tab ? active : null} aria-current=${t.id === tab ? "page" : null}
               className=${"flex shrink-0 items-center gap-2 border-r border-t-2 border-r-line px-4 text-[13px] transition-colors " +
                 (t.id === tab ? "border-t-accent bg-panel text-fg" : "border-t-transparent text-dim hover:bg-panel/60 hover:text-fg")}>
              <span className=${"text-[10px] font-bold " + (t.file.endsWith(".pdf") ? "text-[#d9776a]" : "text-accent")}>${t.file.endsWith(".pdf") ? "PDF" : "TSX"}</span>
              ${t.file}
            </a>`)}
        </nav>
      </div>
    </header>`;
}

function StatusBar({ tab }) {
  const [ln, setLn] = useState(1);
  const [time, setTime] = useState("");
  useEffect(() => {
    let f = 0;
    const onScroll = () => { if (!f) f = requestAnimationFrame(() => { f = 0; setLn(Math.floor(scrollY / 24) + 1); }); };
    const fmt = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", hour: "2-digit", minute: "2-digit", hour12: false, timeZoneName: "short" });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 15000);
    addEventListener("scroll", onScroll, { passive: true });
    return () => { removeEventListener("scroll", onScroll); clearInterval(id); };
  }, []);
  const pdf = tab === "resume";
  return html`
    <footer className="fixed inset-x-0 bottom-0 z-40 flex h-7 items-center gap-4 border-t border-line bg-panel px-3 text-[11px] text-dim">
      <span><span className="text-accent">⎇</span> main</span>
      <span className="hidden sm:inline">✓ 0 problems</span>
      <span className="hidden lg:inline">press 1–6 to switch files</span>
      <span className="ml-auto flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-accent"></span>open to 2027 roles</span>
      <span className="hidden tabular-nums sm:inline">Ln ${ln}, Col 1</span>
      <span className="hidden md:inline">${pdf ? "PDF" : "TypeScript React"}</span>
      <span className="hidden tabular-nums md:inline">granville ${time}</span>
    </footer>`;
}

// Decorative line numbers down the left edge, as tall as the page
function Gutter({ target, tab }) {
  const [n, setN] = useState(60);
  useEffect(() => {
    const ro = new ResizeObserver(() => setN(Math.max(30, Math.floor(target.current.offsetHeight / 24) - 2)));
    ro.observe(target.current);
    return () => ro.disconnect();
  }, [target, tab]);
  return html`
    <pre aria-hidden="true" className="hidden w-14 shrink-0 select-none overflow-hidden border-r border-line/70 pr-3 pt-12 text-right text-[11px] leading-6 text-faint md:block">${Array.from({ length: n }, (_, i) => i + 1).join("\n")}</pre>`;
}

function App() {
  const [route, setRoute] = useState(parseHash);
  const [lb, setLb] = useState(null);
  const page = useRef(null);
  const openLb = useCallback((items, i) => setLb({ items, i }), []);

  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey || document.querySelector("[role=dialog]")) return;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
      const t = TABS[+e.key - 1];
      if (t) location.hash = t.id;
    };
    addEventListener("hashchange", onHash);
    addEventListener("keydown", onKey);
    return () => { removeEventListener("hashchange", onHash); removeEventListener("keydown", onKey); };
  }, []);

  // Jump to a project or artwork when the hash names one, otherwise start at the top
  useEffect(() => {
    const t = TABS.find((x) => x.id === route.tab);
    document.title = `${t.file} · Shizza Shafqat`;
    const el = route.sub && document.getElementById((route.tab === "artwork" ? "a-" : "p-") + route.sub);
    if (el) el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    else scrollTo(0, 0);
  }, [route]);

  const pages = { home: Home, projects: Projects, artwork: Artwork, denison: Denison, contact: Contact, resume: Resume };
  const Page = pages[route.tab];
  return html`
    <${React.Fragment}>
      <a href="#main" onClick=${(e) => { e.preventDefault(); page.current?.focus(); }} className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:bg-accent focus:px-3 focus:py-1 focus:text-ink">skip to content</a>
      <${TabBar} tab=${route.tab} />
      <div className="flex pb-7 pt-11">
        <${Gutter} target=${page} tab=${route.tab} />
        <main ref=${page} tabIndex="-1" className="min-w-0 flex-1 self-start outline-none">
          <div key=${route.tab} className="tab-open mx-auto max-w-[1400px] px-4 py-10 sm:px-8 sm:py-12 lg:px-12">
            <${Page} openLb=${openLb} />
          </div>
          <p className="mx-auto max-w-[1400px] px-4 pb-10 text-xs text-faint sm:px-8 lg:px-12">
            ${"// © " + new Date().getFullYear() + " shizza fatima shafqat · drawn + coded by hand · "}<a href="../" className="underline underline-offset-4 hover:text-dim">classic version</a>
          </p>
        </main>
      </div>
      <${StatusBar} tab=${route.tab} />
      ${lb ? html`<${Lightbox} lb=${lb} setLb=${setLb} />` : null}
    <//>`;
}

ReactDOM.createRoot(document.getElementById("root")).render(html`<${App} />`);

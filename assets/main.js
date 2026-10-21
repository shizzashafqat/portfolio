// Projects shown in "selected work". Edit descriptions and tags to tell each story.
const projects = [
  { name: "Sufism", repo: "sufism2", blurb: "A digital humanities project exploring Sufi texts and traditions through code.", tags: "digital humanities · data" },
  { name: "PathFinder", repo: "PathFinderProject", blurb: "Pathfinding algorithms, visualized step by step.", tags: "algorithms · graphs" },
  { name: "Linguistics Final", repo: "linguistics_final_project", blurb: "Computational analysis of language.", tags: "nlp · python" },
  { name: "Graphs", repo: "271_graphs_project", blurb: "Graph data structures and traversal from scratch.", tags: "data structures · java" },
  { name: "Hotwheel Reader", repo: "Hotwheel-Reader-Project", blurb: "Parsing and exploring a collection dataset.", tags: "data · java" },
  { name: "Adept Internship", repo: "Adept-Internship", blurb: "Work from my internship at Adept.", tags: "industry · engineering" },
];

const cards = document.getElementById("cards");
projects.forEach((p, i) => {
  const a = document.createElement("a");
  a.className = "card";
  a.href = `https://github.com/shizzashafqat/${p.repo}`;
  a.target = "_blank";
  a.rel = "noopener";
  a.innerHTML = `
    <span class="idx">${String(i + 1).padStart(2, "0")} /</span>
    <h3>${p.name}</h3>
    <p>${p.blurb}</p>
    <div class="tags">${p.tags}</div>`;
  cards.appendChild(a);
});

document.getElementById("year").textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Typewriter tagline
const typed = document.querySelector(".typed");
const words = typed.dataset.words.split("|");
if (reduceMotion) {
  typed.textContent = words[0];
} else {
  let w = 0, c = 0, deleting = false;
  (function tick() {
    const word = words[w];
    typed.textContent = word.slice(0, c);
    if (!deleting && c === word.length) { deleting = true; return setTimeout(tick, 1800); }
    if (deleting && c === 0) { deleting = false; w = (w + 1) % words.length; }
    c += deleting ? -1 : 1;
    setTimeout(tick, deleting ? 35 : 75);
  })();
}

// Custom cursor + card spotlight and tilt
const cursor = document.querySelector(".cursor");
const mouse = { x: innerWidth / 2, y: innerHeight / 2, active: false };
addEventListener("mousemove", (e) => {
  mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true;
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});
document.addEventListener("mouseover", (e) => {
  cursor.classList.toggle("hover", !!e.target.closest("a"));
});
document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    card.style.setProperty("--mx", x + "px");
    card.style.setProperty("--my", y + "px");
    if (!reduceMotion) {
      const rx = ((y / r.height) - 0.5) * -8, ry = ((x / r.width) - 0.5) * 8;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    }
  });
  card.addEventListener("mouseleave", () => { card.style.transform = ""; });
});

// Scroll reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => en.isIntersecting && en.target.classList.add("in"));
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// Generative flow field: particles drift along a noise field and bend around the cursor
const canvas = document.getElementById("field");
const ctx = canvas.getContext("2d");
let W, H, particles;
const COLORS = ["255,107,91", "124,240,208", "242,237,228"];

function resize() {
  const dpr = Math.min(devicePixelRatio || 1, 2);
  W = canvas.width = innerWidth * dpr;
  H = canvas.height = innerHeight * dpr;
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = "#0b0a10";
  ctx.fillRect(0, 0, W, H);
  const count = Math.min(900, Math.floor((innerWidth * innerHeight) / 1800));
  particles = Array.from({ length: count }, () => spawn());
}
function spawn() {
  return {
    x: Math.random() * W, y: Math.random() * H,
    life: 100 + Math.random() * 300,
    color: COLORS[Math.random() < 0.6 ? 2 : Math.floor(Math.random() * 2)],
  };
}
// Cheap smooth pseudo-noise built from layered sines
function angleAt(x, y, t) {
  const s = 0.0015;
  return (Math.sin(x * s + t) + Math.cos(y * s * 1.3 - t * 0.7) + Math.sin((x + y) * s * 0.6 + t * 0.3)) * Math.PI;
}

let t = 0;
function frame() {
  t += 0.002;
  ctx.fillStyle = "rgba(11,10,16,0.06)";
  ctx.fillRect(0, 0, W, H);
  const dpr = W / innerWidth;
  const mx = mouse.x * dpr, my = mouse.y * dpr;
  for (const p of particles) {
    let a = angleAt(p.x, p.y, t);
    if (mouse.active) {
      const dx = p.x - mx, dy = p.y - my, d = Math.hypot(dx, dy);
      if (d < 180 * dpr) a += (1 - d / (180 * dpr)) * Math.atan2(dy, dx);
    }
    const nx = p.x + Math.cos(a) * 1.2 * dpr, ny = p.y + Math.sin(a) * 1.2 * dpr;
    ctx.strokeStyle = `rgba(${p.color},0.5)`;
    ctx.lineWidth = dpr * 0.8;
    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(nx, ny); ctx.stroke();
    p.x = nx; p.y = ny;
    if (--p.life < 0 || p.x < 0 || p.x > W || p.y < 0 || p.y > H) Object.assign(p, spawn());
  }
  requestAnimationFrame(frame);
}

addEventListener("resize", resize);
resize();
if (!reduceMotion) frame();

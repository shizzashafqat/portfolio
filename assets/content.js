// ─────────────────────────────────────────────────────────────
//  Everything on the site lives here. Edit this file to update it.
//
//  Add a doodle:  drop the image in assets/doodles/ and add an entry to `doodles`.
//  Add a photo:   drop it in assets/photos/ and add an entry to `photos`.
//  Add a link:    add { label, href } to a project's or job's `links`.
//
//  `lens` tags decide what lights up when a visitor picks AI, SWE, or PM.
// ─────────────────────────────────────────────────────────────

window.CONTENT = {
  name: "Shizza Fatima Shafqat",
  short: "Shizza",
  email: "shafqa_s1@denison.edu",
  linkedin: "https://linkedin.com/in/shizza-shafqat",
  github: "https://github.com/shizzashafqat",
  resume: "", // e.g. "assets/shizza-shafqat-resume.pdf"

  intro: {
    ai: "I build AI that people can trust: Socratic tutors, LLM pipelines, and the dashboards that keep them honest.",
    swe: "I ship real software: Node.js systems, Swift apps, JavaScript dashboards, and the plumbing that connects them.",
    pm: "I turn messy processes into products: talking to stakeholders, designing workflows, and measuring what changed.",
  },

  experience: [
    {
      org: "Denison University",
      role: "AI & Innovation Intern · Denison AI / King Center",
      when: "Aug 2026 – now",
      where: "Granville, OH",
      color: "red",
      lens: ["ai", "swe", "pm"],
      bullets: [
        { text: "Built an automated pipeline and JavaScript dashboard tracking 100M+ monthly tokens across Anthropic and OpenAI, giving staff visibility into adoption, usage trends, and costs.", lens: ["swe", "pm", "ai"] },
        { text: "Developing Socratic AI chatbots for modern language courses that help instructors spot learning gaps while protecting student privacy.", lens: ["ai", "pm"] },
        { text: "Leading research on fair token allocation for Denison's AI platform, advised by a CS professor.", lens: ["ai", "pm"] },
      ],
      links: [],
    },
    {
      org: "Denison University",
      role: "AI Ambassador & Programs Intern · ITS",
      when: "May – Aug 2026",
      where: "Granville, OH",
      color: "purple",
      lens: ["ai", "swe", "pm"],
      bullets: [
        { text: "Built an event management website consolidating schedules, attendance, and credit records across 3 departments for weekly AI events with 100+ attendees.", lens: ["swe", "pm"] },
        { text: "Designed and deployed an AI-powered event planning workflow for 15+ teammates, cutting 6 manual steps from every feasibility and privacy review.", lens: ["ai", "pm"] },
        { text: "Co-designed and taught a 4-day AI literacy camp for 30+ high school students.", lens: ["ai", "pm"] },
      ],
      links: [],
    },
    {
      org: "HeyPossible Inc",
      role: "AI Automation Intern",
      when: "Jun – Aug 2025",
      where: "Seattle, WA",
      color: "cyan",
      lens: ["swe", "pm", "ai"],
      bullets: [
        { text: "Built and deployed a Node.js mentor-matching system with ranked preferences, capacity constraints, and fallback logic, wired into Airtable, Sheets, Tally, and Slack via APIs and webhooks.", lens: ["swe", "ai"] },
        { text: "Partnered with the CEO on intake, matching, and scheduling for 200+ student cohorts, saving staff 4–6 hours a week with zero double bookings.", lens: ["pm"] },
      ],
      links: [],
    },
    {
      org: "Adept Tech Solutions",
      role: "GenAI Intern",
      when: "May – Aug 2024",
      where: "Islamabad, Pakistan",
      color: "green",
      lens: ["ai", "swe"],
      bullets: [
        { text: "Built a multi-step LLM workflow in Python that automates resume screening, interview-question generation, and scoring, cutting recruiter review time by 80% in a pilot.", lens: ["ai", "swe", "pm"] },
      ],
      links: [{ label: "repo", href: "https://github.com/shizzashafqat/Adept-Internship" }],
    },
  ],

  projects: [
    {
      title: "Hot Wheels Garage",
      kind: "iOS visual recognition app",
      color: "yellow",
      lens: ["ai", "swe"],
      blurb: "Snap a photo, and the app names the exact Hot Wheels model. I pushed identification accuracy from 72% to 91% on a 100-image eval set by reworking preprocessing, prompts, and recognition logic, then hardened it with request validation, retries with backoff, typed JSON decoding, and local persistence for collections.",
      stack: ["Swift", "SwiftUI", "Vision AI", "Eval sets"],
      stat: "72% → 91%",
      image: "",
      links: [{ label: "code", href: "https://github.com/shizzashafqat/Hotwheel-Reader-Project" }],
    },
    {
      title: "Re-Imagining Sirkap",
      kind: "AI reconstruction of an archaeological site",
      color: "orange",
      lens: ["ai", "pm"],
      blurb: "An interactive reconstruction of the ancient city of Sirkap. I mapped 200+ archaeological features in Python and ArcGIS, then grounded AI-generated visuals and audio in findings from 50+ excavation reports, so the imagination stays tied to evidence.",
      stack: ["Python", "ArcGIS", "Generative AI", "Digital Humanities"],
      stat: "200+ features",
      image: "",
      links: [], // TODO: add the reconstruction link, e.g. { label: "explore", href: "https://..." }
    },
    {
      title: "Token Dashboard",
      kind: "Usage analytics for Denison AI",
      color: "red",
      lens: ["swe", "pm", "ai"],
      blurb: "An automated pipeline and JavaScript dashboard that follows 100M+ tokens a month across Anthropic and OpenAI, so the university can actually see who is using AI, how, and what it costs.",
      stack: ["JavaScript", "Data pipelines", "APIs"],
      stat: "100M+ tokens/mo",
      image: "",
      links: [],
    },
    {
      title: "Mentor Matcher",
      kind: "Matching engine at HeyPossible",
      color: "cyan",
      lens: ["swe", "pm"],
      blurb: "A Node.js matching system with ranked preferences, capacity limits, and graceful fallbacks, glued to Airtable, Sheets, Tally, and Slack. It runs every summer cohort of 200+ students.",
      stack: ["Node.js", "Webhooks", "Airtable", "Slack API"],
      stat: "0 double bookings",
      image: "",
      links: [],
    },
  ],

  leadership: [
    { title: "AI Policy Committee", note: "Student rep (1 of 2) advising Denison's campus-wide AI guidelines", lens: ["ai", "pm"] },
    { title: "Women in Math, Data Analytics & CS", note: "President", lens: ["pm", "swe"] },
    { title: "CS Department Fellow", note: "1 of 4", lens: ["swe"] },
    { title: "Knowlton Center", note: "Tech & Data Science Peer Career Fellow", lens: ["pm"] },
  ],
  leadershipSummary: "60+ campus events with speakers, faculty, and alumni · $10K+ in budgets managed",

  skills: {
    languages: ["Python", "JavaScript", "C++", "R", "Swift", "Go"],
    frameworks: ["React", "Node.js", "PyTorch", "TensorFlow", "pandas", "SwiftUI"],
    tools: ["Git", "Tableau", "n8n", "ArcGIS"],
  },

  // Places on the journey strip. `scene` picks a hand-drawn skyline from main.js.
  places: [
    { city: "Islamabad", note: "my first GenAI internship", scene: "islamabad" },
    { city: "Seattle", note: "shipping automation at a startup", scene: "seattle" },
    { city: "Granville", note: "Denison, the hill, and the Chapel", scene: "denison" },
    { city: "New York", note: "the skyline I keep drawing", scene: "nyc" },
  ],

  doodles: [
    { src: "assets/doodles/denison-doodle.jpg", title: "Go Big Red", note: "Swasey Chapel surrounded by everything Denison means to me: AI, data, coffee, music, and the deer." },
    // { src: "assets/doodles/next-one.jpg", title: "...", note: "..." },
  ],

  photos: [
    // { src: "assets/photos/camp.jpg", caption: "AI literacy camp, summer 2026" },
  ],
};

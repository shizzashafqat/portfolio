// ─────────────────────────────────────────────────────────────
//  Everything on the site lives here. Edit this file to update it.
//
//  Add a link:    add { label, href } to a project's or job's `links`.
//  Add a course:  add it to `about.courses`.
//  Project visual: a project shows its `screens` (phone shots), its `media`
//                  (photos/video, files in assets/projects/), or a `flow` diagram
//                  (sources → pipeline → output). With none of them, nothing is shown.
//  Project "why": an optional `why` line on a project says who it was for and what
//                  you decided because of them. It shows under the blurb.
//
//  `lens` tags decide which roles a job or project belongs to:
//  "ds" data science, "swe" software engineering, "pm" product management.
// ─────────────────────────────────────────────────────────────

window.CONTENT = {
  name: "Shizza Fatima Shafqat",
  short: "Shizza",
  email: "shafqa_s1@denison.edu",
  linkedin: "https://linkedin.com/in/shizza-shafqat",
  github: "https://github.com/shizzashafqat",
  resume: "", // e.g. "assets/shizza-shafqat-resume.pdf"
  availability: "full-time, starting June 2027",

  // The short first-person bio at the top of the page
  bio: [
    "CS senior at Denison (May '27).",
    "I build AI tools people actually use: campus-wide token analytics, mentor matching for 200+ students, an iOS car-recognition app.",
  ],

  // Three results shown near the top. `project` links to that project.
  highlights: [
    { stat: "100M+", label: "tokens a month tracked across Anthropic + OpenAI", project: "Token Dashboard" },
    { stat: "72% → 91%", label: "car-recognition accuracy on a 100-image eval set", project: "Hot Wheels Garage" },
    { stat: "200+", label: "students matched with mentors each cohort", project: "Mentor Matcher" },
  ],

  // The "about" block at the top of the page
  about: {
    year: "senior · class of 2027",
    study: "computer science (b.s.) · minor in digital humanities",
    school: "denison university · granville, oh",
    gpa: "3.65 · dean's list",
    courses: ["Data Structures", "Algorithm Design", "Computer Systems", "Object-Oriented Programming", "Analyzing Linguistic Data"],
  },

  // The roles I'm looking for. Clicking one shows the projects tagged with its `lens`.
  roles: [
    { lens: "ds", label: "data science", intro: "I turn messy, real data into answers: token usage across a university, vowel formants across five languages, 200+ features of an ancient city." },
    { lens: "swe", label: "software engineering", intro: "I ship real software: Node.js systems, Swift apps, JavaScript dashboards, and the plumbing that connects them." },
    { lens: "pm", label: "product management", intro: "I turn messy processes into products: talking to people, designing workflows, and measuring what changed." },
  ],

  experience: [
    {
      org: "Denison University",
      role: "AI & Innovation Intern · Denison AI / King Center",
      when: "Aug 2026 – now",
      where: "Granville, OH",
      lens: ["ds", "swe", "pm"],
      summary: "I help Denison see how it actually uses AI. I built the pipeline and dashboard that follow every token the campus spends, and I'm building Socratic tutors for language classes that show instructors where students get stuck.",
      impact: ["100M+ tokens/mo tracked", "Socratic AI tutors", "fair token allocation research"],
      bullets: [
        { text: "Built an automated pipeline and JavaScript dashboard tracking 100M+ monthly tokens across Anthropic and OpenAI, giving staff visibility into adoption, usage trends, and costs.", lens: ["swe", "pm", "ds"] },
        { text: "Developing Socratic AI chatbots for modern language courses that help instructors spot learning gaps while protecting student privacy.", lens: ["ds", "pm"] },
        { text: "Leading research on fair token allocation for Denison's AI platform, advised by a CS professor.", lens: ["ds", "pm"] },
      ],
      links: [],
    },
    {
      org: "Denison University",
      role: "AI Ambassador & Programs Intern · ITS",
      when: "May – Aug 2026",
      where: "Granville, OH",
      lens: ["swe", "pm"],
      summary: "I pulled Denison's weekly AI events into one system: a site for schedules, attendance, and credit across three departments, and an AI planning workflow for my team. I also co-taught an AI camp for high schoolers.",
      impact: ["3 departments, 1 site", "6 manual steps removed", "30+ students taught"],
      bullets: [
        { text: "Built an event management website consolidating schedules, attendance, and credit records across 3 departments for weekly AI events with 100+ attendees.", lens: ["swe", "pm"] },
        { text: "Designed and deployed an AI-powered event planning workflow for 15+ teammates, cutting 6 manual steps from every feasibility and privacy review.", lens: ["pm"] },
        { text: "Co-designed and taught a 4-day AI literacy camp for 30+ high school students.", lens: ["pm"] },
      ],
      links: [],
    },
    {
      org: "HeyPossible Inc",
      role: "AI Automation Intern",
      when: "Jun – Aug 2025",
      where: "Seattle, WA",
      lens: ["swe", "pm"],
      summary: "I automated how a startup matches each summer cohort of students with mentors: a Node.js engine that respects everyone's preferences and limits, wired into the tools the team already used.",
      impact: ["4–6 hrs/week saved", "200+ students per cohort", "0 double bookings"],
      bullets: [
        { text: "Built and deployed a Node.js mentor-matching system with ranked preferences, capacity constraints, and fallback logic, wired into Airtable, Sheets, Tally, and Slack via APIs and webhooks.", lens: ["swe"] },
        { text: "Partnered with the CEO on intake, matching, and scheduling for 200+ student cohorts, saving staff 4–6 hours a week with zero double bookings.", lens: ["pm"] },
      ],
      links: [],
    },
    {
      org: "Adept Tech Solutions",
      role: "GenAI Intern",
      when: "May – Aug 2024",
      where: "Islamabad, Pakistan",
      lens: ["ds", "swe"],
      summary: "My first AI build: a multi-step LLM workflow in Python that screens resumes, writes interview questions, and scores candidates.",
      impact: ["80% less recruiter review time (pilot)"],
      bullets: [
        { text: "Built a multi-step LLM workflow in Python that automates resume screening, interview-question generation, and scoring, cutting recruiter review time by 80% in a pilot.", lens: ["ds", "swe", "pm"] },
      ],
      links: [{ label: "repo", href: "https://github.com/shizzashafqat/Adept-Internship" }],
    },
  ],

  projects: [
    {
      title: "Token Dashboard",
      kind: "Usage analytics for Denison AI",
      lens: ["ds", "swe", "pm"],
      blurb: "An automated pipeline and JavaScript dashboard that follows 100M+ tokens a month across Anthropic and OpenAI, so the university can actually see who is using AI, how, and what it costs.",
      stack: ["JavaScript", "Data pipelines", "APIs"],
      stat: "100M+ tokens/mo",
      // Shown as a simple data-flow diagram until there's a screenshot to share
      flow: [
        { label: "sources", items: ["Anthropic usage", "OpenAI usage"] },
        { label: "pipeline", items: ["automated pull", "usage + cost totals"] },
        { label: "dashboard", items: ["adoption", "usage trends", "costs"] },
      ],
      // why: "", // who it's for, what they told you, what you chose to leave out
      links: [],
    },
    {
      title: "Mentor Matcher",
      kind: "Matching engine at HeyPossible",
      lens: ["swe", "pm"],
      blurb: "A Node.js matching system with ranked preferences, capacity limits, and graceful fallbacks, glued to Airtable, Sheets, Tally, and Slack. It runs every summer cohort of 200+ students.",
      stack: ["Node.js", "Webhooks", "Airtable", "Slack API"],
      stat: "4–6 hrs/week saved",
      flow: [
        { label: "intake", items: ["Tally forms", "Airtable", "Google Sheets"] },
        { label: "matcher", items: ["ranked preferences", "capacity limits", "fallbacks"] },
        { label: "out", items: ["Slack", "Airtable"] },
      ],
      // why: "",
      links: [],
    },
    {
      title: "Hot Wheels Garage",
      kind: "iOS visual recognition app",
      lens: ["ds", "swe"],
      blurb: "Snap a photo, and the app names the exact Hot Wheels model. I pushed identification accuracy from 72% to 91% on a 100-image eval set by reworking preprocessing, prompts, and recognition logic, then hardened it with request validation, retries with backoff, typed JSON decoding, and local persistence for collections.",
      stack: ["Swift", "SwiftUI", "Vision AI", "Eval sets"],
      stat: "72% → 91%",
      // App screenshots shown with the project, in order. Add { src, caption } to show more.
      screens: [
        { src: "assets/projects/hotwheels-1-validate.webp", caption: "validate · checks it's really a Hot Wheels car" },
        { src: "assets/projects/hotwheels-2-result.webp", caption: "recognize · casting, year, variation + fun facts" },
        { src: "assets/projects/hotwheels-3-confidence.webp", caption: "explain · how the confidence score works" },
        { src: "assets/projects/hotwheels-4-collection.webp", caption: "collect · saved car with AI-generated art" },
      ],
      links: [{ label: "code", href: "https://github.com/shizzashafqat/Hotwheel-Reader-Project" }],
    },
    {
      title: "Re-Imagining Sirkap",
      kind: "AI reconstruction of an archaeological site",
      lens: ["ds", "pm"],
      blurb: "An interactive reconstruction of the ancient city of Sirkap. I mapped 200+ archaeological features in Python and ArcGIS, then grounded AI-generated visuals and audio in findings from 50+ excavation reports, so the imagination stays tied to evidence.",
      stack: ["Python", "ArcGIS", "Generative AI", "Digital Humanities"],
      stat: "200+ features",
      // Photos and videos shown with the project. type is "video" or "image".
      media: [
        { type: "video", src: "assets/projects/sirkap-welcome.mp4", webm: "assets/projects/sirkap-welcome.webm", poster: "assets/projects/sirkap-welcome-poster.webp", caption: "welcome to sirkap · ai-generated flythrough of the reconstruction" },
        { type: "image", src: "assets/projects/sirkap-research.webp", caption: "presenting the research · re-imagining sirkap" },
      ],
      links: [{ label: "explore the reconstruction", href: "https://storymaps.arcgis.com/stories/f3ba75d75b484183b4a199fbe45e07e7" }],
    },
    {
      title: "The Soul of Qawwali",
      kind: "Digital humanities research · Sufism",
      lens: ["ds", "pm"],
      blurb: "How did qawwali move from a Sufi shrine to Coke Studio, wedding stages, and Spotify, and what does that change for how younger Pakistanis understand Sufism? I traced it from the shrine and sama' through radio, studio, and global playlists, and argue that it adapted rather than lost its soul. The site pairs the research with AI-generated scenes. It grew out of my paper on how Sufi poets, a Coke Studio qawwali, and my family's oral telling each reshape the tale of Heer Ranjha.",
      stack: ["Research", "Digital Humanities", "Generative AI", "Storytelling"],
      stat: "shrine → playlist",
      media: [
        { type: "video", src: "assets/projects/qawwali-stage.mp4", webm: "assets/projects/qawwali-stage.webm", poster: "assets/projects/qawwali-stage-poster.webp", caption: "qawwali in the modern age · ai-generated concert scene" },
        { type: "image", src: "assets/projects/qawwali-slide-title.webp", caption: "the soul of qawwali · from sacred ritual to global anthem" },
        { type: "image", src: "assets/projects/qawwali-slide-question.webp", caption: "the research question" },
      ],
      links: [
        { label: "visit the site", href: "https://shizzashafqat.github.io/sufism2/" },
        { label: "read the heer ranjha paper (pdf)", href: "assets/projects/heer-ranjha-paper.pdf" },
      ],
    },
    {
      title: "How L1 Shapes Urdu Vowels",
      kind: "Phonetics study · Analyzing Linguistic Data (DH 281)",
      lens: ["ds"],
      blurb: "Urdu is Pakistan's lingua franca, but only 9.5% of people grow up speaking it. I recorded speakers whose first languages are Punjabi, Sindhi, Balochi, Shina, and Pashto, segmented the vowels by hand in PRAAT, and plotted F1/F2 formants in R. Their first language shows: front vowels like /ɪ/ shift forward for Shina and Punjabi speakers, Sindhi speakers shorten the long /uː/, while /aː/ and /iː/ stay stable for everyone.",
      stack: ["PRAAT", "R", "Formant analysis", "Data collection"],
      stat: "5 first languages",
      media: [
        { type: "image", src: "assets/projects/urdu-vowels-poster.webp", caption: "research poster · click to read it full size" },
      ],
      links: [],
    },
  ],

  leadership: [
    { title: "AI Policy Committee", note: "Student rep (1 of 2) advising Denison's campus-wide AI guidelines", lens: ["pm"] },
    { title: "Women in Math, Data Analytics & CS", note: "President", lens: ["pm", "ds", "swe"] },
    { title: "CS Department Fellow", note: "1 of 4", lens: ["swe"] },
    { title: "Knowlton Center", note: "Tech & Data Science Peer Career Fellow", lens: ["pm", "ds"] },
  ],
  leadershipSummary: "60+ campus events with speakers, faculty, and alumni · $10K+ in budgets managed",

  skills: {
    languages: ["Python", "JavaScript", "C++", "R", "Swift", "Go"],
    frameworks: ["React", "Node.js", "PyTorch", "TensorFlow", "pandas", "SwiftUI"],
    tools: ["Git", "Tableau", "n8n", "ArcGIS", "PRAAT"],
  },

  doodles: [
    { src: "assets/doodles/denison-doodle.jpg", title: "Go Big Red", note: "Swasey Chapel surrounded by everything Denison means to me: AI, data, coffee, music, and the deer." },
  ],
};

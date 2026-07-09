/* ============================================================
LEARNING PLATFORMS DATA (Hands-on Labs)
------------------------------------------------------------
Only platforms with REAL hands-on practice are listed here.

HOW TO ADD A NEW PLATFORM:
1. Copy the "hackthebox" object below as a starter template.
2. Give it a unique "id" (used for its detail page URL:
learning-platform.html?id=your-id).
3. Fill in the fields.

HOW TO ADD A NEW LEARNING PATH:
1. Copy an object from "completedPaths" or "inProgressPaths"
(or "currentlyLearning" for paths you just started).
2. Fill in title / progress / difficulty / summary /
whatLearned. No page redesign needed.

HOW TO ADD A NEW CERTIFICATE / SCREENSHOT / NOTE:
Add an entry to "certificates" or "screenshots", or edit
"notes". That's it \u2014 everything renders automatically.
============================================================ */

const LEARNING_PLATFORMS = [
   {
      id: "tryhackme",
      name: "TryHackMe",
      logo: "THM",
      accent: "red",
      description: "Hands-on, guided cybersecurity rooms and learning paths covering Blue Team operations, red teaming, cloud defense, and AI security.",
      profileUrl: "#",
      isPlaceholderProfile: true,

      completedPaths: [
         { title: "SOC Level 1", status: "completed", progress: 100, difficulty: "Add difficulty (Beginner / Intermediate / Advanced)", summary: "Add a short description of what this path covers and the skills it builds.", whatLearned: ["Add 2-3 key takeaways from this path."] },
         { title: "Security Engineer", status: "completed", progress: 100, difficulty: "Add difficulty (Beginner / Intermediate / Advanced)", summary: "Add a short description of what this path covers and the skills it builds.", whatLearned: ["Add 2-3 key takeaways from this path."] },
         { title: "DevSecOps", status: "completed", progress: 100, difficulty: "Add difficulty (Beginner / Intermediate / Advanced)", summary: "Add a short description of what this path covers and the skills it builds.", whatLearned: ["Add 2-3 key takeaways from this path."] },
         { title: "AI Security", status: "completed", progress: 100, difficulty: "Add difficulty (Beginner / Intermediate / Advanced)", summary: "Add a short description of what this path covers and the skills it builds.", whatLearned: ["Add 2-3 key takeaways from this path."] },
         { title: "Advanced Endpoint Investigations", status: "completed", progress: 100, difficulty: "Add difficulty (Beginner / Intermediate / Advanced)", summary: "Add a short description of what this path covers and the skills it builds.", whatLearned: ["Add 2-3 key takeaways from this path."] },
         { title: "Red Teaming", status: "completed", progress: 100, difficulty: "Add difficulty (Beginner / Intermediate / Advanced)", summary: "Add a short description of what this path covers and the skills it builds.", whatLearned: ["Add 2-3 key takeaways from this path."] }
         ],

      inProgressPaths: [
         { title: "SOC Level 2", status: "in-progress", progress: 87, difficulty: "Add difficulty (Beginner / Intermediate / Advanced)", summary: "Add a short description of what this path covers and the skills it builds." },
         { title: "Web Application Red Teaming", status: "in-progress", progress: 94, difficulty: "Add difficulty (Beginner / Intermediate / Advanced)", summary: "Add a short description of what this path covers and the skills it builds." },
         { title: "CompTIA PenTest+", status: "in-progress", progress: 77, difficulty: "Add difficulty (Beginner / Intermediate / Advanced)", summary: "Add a short description of what this path covers and the skills it builds." }
         ],

      currentlyLearning: [
         { title: "Defending AWS", status: "learning", progress: 6, difficulty: "Add difficulty (Beginner / Intermediate / Advanced)", summary: "Add a short description of what this path covers and the skills it builds." }
         ],

      certificates: [
         { title: "TryHackMe Certificate 1 (confirm which path this belongs to)", url: "https://tryhackme-certificates.s3-eu-west-1.amazonaws.com/THM-GCMSZZTMZQ.pdf" },
         { title: "TryHackMe Certificate 2 (confirm which path this belongs to)", url: "https://tryhackme-certificates.s3-eu-west-1.amazonaws.com/THM-QH1NANXHKS.pdf" }
         ],

      screenshots: [
         { id: "thm-1", caption: "TryHackMe profile overview", isPlaceholder: true },
         { id: "thm-2", caption: "Completed path dashboard", isPlaceholder: true }
         ],

      skillsGained: ["SOC Operations", "Incident Response", "Threat Hunting", "Cloud Security (AWS)", "DevSecOps", "Red Teaming", "Web Application Security", "AI Security", "Endpoint Investigation", "Penetration Testing"],
      notes: "Add personal notes about your TryHackMe journey."
   },
   {
      id: "hackthebox",
      name: "Hack The Box",
      logo: "HTB",
      accent: "green",
      description: "A realistic, competitive platform for practicing penetration testing and offensive security skills against live machines and guided Job Role Paths.",
      profileUrl: "#",
      isPlaceholderProfile: true,

      completedPaths: [],
      inProgressPaths: [],
      currentlyLearning: [],

      certificates: [],

      screenshots: [
         { id: "htb-1", caption: "Hack The Box profile overview", isPlaceholder: true },
         { id: "htb-2", caption: "Job Role Path progress", isPlaceholder: true }
         ],

      skillsGained: ["Add skills as you complete Job Role Paths and machines."],
      notes: "Add personal notes about your Hack The Box journey. Add your completed Job Role Paths to completedPaths above once you finish one."
   }
   ];

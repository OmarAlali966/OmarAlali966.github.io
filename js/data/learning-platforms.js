/* ============================================================
   LEARNING PLATFORMS DATA
   ------------------------------------------------------------
   HOW TO ADD A NEW PLATFORM:
   1. Copy an object below.
   2. Give it a unique "id" (used for its detail page URL:
      learning-platform.html?id=your-id).
   3. Fill in the fields \u2014 the Learning Platforms hub and
      detail page render automatically from this file.
   ============================================================ */

const LEARNING_PLATFORMS = [
  {
        id: "tryhackme",
        name: "TryHackMe",
        logo: "THM",
        accent: "red",
        description: "Hands-on, guided cybersecurity rooms covering offensive and defensive security fundamentals.",
        profileUrl: "#",
        isPlaceholderProfile: true,
        progress: "Add current progress (e.g. rank, rooms completed)",
        badges: ["Add badge names as you earn them"],
        certificates: ["Add TryHackMe certificates as you earn them"],
        learningPaths: ["Add learning paths in progress or completed (e.g. SOC Level 1, Pre Security)"],
        screenshots: [
          { id: "thm-1", caption: "TryHackMe profile overview", isPlaceholder: true },
          { id: "thm-2", caption: "Completed room / path", isPlaceholder: true }
              ],
        whatLearned: ["Add key concepts learned from rooms completed so far."],
        skillsGained: ["Linux Fundamentals", "Web Enumeration", "Privilege Escalation Basics"],
        notes: "Add personal notes about your TryHackMe journey."
  },
  {
        id: "hackthebox",
        name: "Hack The Box",
        logo: "HTB",
        accent: "green",
        description: "A realistic, competitive platform for practicing penetration testing and offensive security skills against live machines.",
        profileUrl: "#",
        isPlaceholderProfile: true,
        progress: "Add current progress (e.g. rank, machines owned)",
        badges: ["Add badge names as you earn them"],
        certificates: ["Add Hack The Box certificates as you earn them"],
        learningPaths: ["Add academy modules or paths in progress"],
        screenshots: [
          { id: "htb-1", caption: "Hack The Box profile overview", isPlaceholder: true },
          { id: "htb-2", caption: "Machine / challenge progress", isPlaceholder: true }
              ],
        whatLearned: ["Add key concepts learned from machines or modules completed so far."],
        skillsGained: ["Enumeration", "Exploitation Fundamentals", "Reporting"],
        notes: "Add personal notes about your Hack The Box journey."
  },
  {
        id: "microsoft-learn",
        name: "Microsoft Learn",
        logo: "MS",
        accent: "indigo",
        description: "Official Microsoft learning paths and modules covering Azure, security operations, and Microsoft Sentinel/Defender.",
        profileUrl: "#",
        isPlaceholderProfile: true,
        progress: "Add current progress (e.g. modules completed, points)",
        badges: ["Add Microsoft Learn badges as you earn them"],
        certificates: ["Microsoft Certified: Security Operations Analyst Associate (SC-200)"],
        learningPaths: ["Add Microsoft Learn paths in progress or completed"],
        screenshots: [
          { id: "msl-1", caption: "Microsoft Learn profile overview", isPlaceholder: true },
          { id: "msl-2", caption: "Completed learning path", isPlaceholder: true }
              ],
        whatLearned: ["Microsoft Sentinel configuration and detection engineering", "KQL fundamentals for threat hunting", "Microsoft Defender incident investigation"],
        skillsGained: ["Microsoft Sentinel", "KQL", "Microsoft Defender", "Azure Fundamentals"],
        notes: "Add personal notes about your Microsoft Learn journey."
  }
  ];

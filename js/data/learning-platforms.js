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
   3. If you have a certificate screenshot, add it to
      assets/certificates/ and set "certImage" (and optionally
      "certImageAlt") on the path object -- it renders as a
      clickable thumbnail that opens full size in a lightbox.

   HOW TO ADD A NEW CERTIFICATE / SCREENSHOT / NOTE:
   Add an entry to "certificates" or "screenshots", or edit
   "notes". That's it -- everything renders automatically.
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
      {
        title: "Pre Security",
        status: "completed",
        progress: 100,
        difficulty: "Easy",
        certImage: "assets/certificates/thm-pre-security.png",
        certImageAlt: "TryHackMe certificate of completion for the Pre Security Learning Path, issued to Omar Adel Alali.",
        summary: "An introductory path covering how computers, networks, and the web work, building the foundation to think like both an attacker and a defender.",
        whatLearned: [
          "Core computing and operating system fundamentals",
          "Networking basics: protocols, addressing, and traffic flow",
          "Introductory web application concepts",
          "Foundational offensive and defensive security thinking"
        ]
      },
      { title: "SOC Level 1", status: "completed", progress: 100, difficulty: "Add difficulty (Beginner / Intermediate / Advanced)", summary: "Add a short description of what this path covers and the skills it builds.", whatLearned: ["Add 2-3 key takeaways from this path."] },
      {
        title: "Security Engineer",
        status: "completed",
        progress: 100,
        difficulty: "Easy",
        certImage: "assets/certificates/thm-security-engineer.png",
        certImageAlt: "TryHackMe certificate of completion for the Security Engineer Learning Path, issued to Omar Adel Alali.",
        summary: "Covers the core skills needed to start a career in security engineering across network, system, and software security.",
        whatLearned: [
          "Network security engineering fundamentals",
          "System hardening and security engineering practices",
          "Secure software engineering principles",
          "Risk management and incident response basics"
        ]
      },
      {
        title: "DevSecOps",
        status: "completed",
        progress: 100,
        difficulty: "Intermediate",
        certImage: "assets/certificates/thm-devsecops.png",
        certImageAlt: "TryHackMe certificate of completion for the DevSecOps Learning Path, issued to Omar Adel Alali.",
        summary: "Focused on integrating security into the software development lifecycle, from CI/CD pipelines to cloud-native infrastructure.",
        whatLearned: [
          "CI/CD pipeline security",
          "Securing Infrastructure as Code (IaC)",
          "Container and containerization security",
          "Applying DevSecOps frameworks in real workflows"
        ]
      },
      {
        title: "Web Application Pentesting",
        status: "completed",
        progress: 100,
        difficulty: "Intermediate",
        certImage: "assets/certificates/thm-web-application-pentesting.png",
        certImageAlt: "TryHackMe certificate of completion for the Web Application Pentesting Learning Path, issued to Omar Adel Alali.",
        summary: "Hands-on path covering how to assess web applications for security vulnerabilities from both the server and client side.",
        whatLearned: [
          "Identifying common web application vulnerabilities",
          "Web authentication and session security mechanisms",
          "Server-side and client-side exploitation techniques",
          "Recommending remediations for web vulnerabilities"
        ]
      },
      { title: "AI Security", status: "completed", progress: 100, difficulty: "Add difficulty (Beginner / Intermediate / Advanced)", summary: "Add a short description of what this path covers and the skills it builds.", whatLearned: ["Add 2-3 key takeaways from this path."] },
      {
        title: "Advanced Endpoint Investigations",
        status: "completed",
        progress: 100,
        difficulty: "Hard",
        certImage: "assets/certificates/thm-advanced-endpoint-investigations.png",
        certImageAlt: "TryHackMe certificate of completion for the Advanced Endpoint Investigations Learning Path, issued to Omar Adel Alali.",
        summary: "Deep dive into endpoint forensics across Windows, Linux, macOS, and mobile, using memory, disk, and file system analysis.",
        whatLearned: [
          "Endpoint investigation techniques across Windows, Linux, macOS, and mobile",
          "Live memory and cold disk image analysis for signs of compromise",
          "File system forensics covering MBR, GPT, FAT32, NTFS, and EXT",
          "Using tools like Volatility, KAPE, SleuthKit, and ALEAPP in real investigations"
        ]
      },
      {
        title: "Red Teaming",
        status: "completed",
        progress: 100,
        difficulty: "Hard",
        certImage: "assets/certificates/thm-red-teaming.png",
        certImageAlt: "TryHackMe certificate of completion for the Red Teaming Learning Path, issued to Omar Adel Alali.",
        summary: "Covers the offensive techniques and tradecraft used by Red Team Operators to simulate real-world adversaries.",
        whatLearned: [
          "Techniques for gaining initial access to target environments",
          "Enumeration and persistence on compromised systems",
          "Evading security solutions and detection controls",
          "Exploiting Active Directory environments"
        ]
      }
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

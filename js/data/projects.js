/* ============================================================
   PROJECTS DATA
   ------------------------------------------------------------
   HOW TO ADD A NEW PROJECT:
   1. Copy an object from FEATURED_PROJECTS or FUTURE_PROJECTS.
   2. Fill in the fields \u2014 the Projects, Project Detail, and
      Security Lab pages render automatically from this file.
   ============================================================ */

const FEATURED_PROJECTS = [
   {
      id: "porchlight",
            name: "PorchLight",
      tagline: "A restaurant discovery web app that finds real tables nearby based on ZIP code and budget.",
          status: "Completed",
          detailPage: "project-porchlight.html",
          liveUrl: "https://porchlight-lime.vercel.app",
          role: "Designed and developed the application from concept to implementation.",
          problem: "Deciding where to eat nearby usually means bouncing between several apps and manually cross-checking location, price, and hours before landing on a choice.",
          solution: "A single-purpose search flow that asks for only a ZIP code and a budget per person, then returns real nearby restaurants that match - no account, no filters to configure, no back-and-forth.",
          overview: "PorchLight is a personal business-idea project: a fast, no-account restaurant discovery tool. Enter a ZIP code and a budget tier, and it surfaces real restaurants nearby that fit, pulling live data so results stay current.",
          architecture: "A lightweight vanilla HTML, CSS, and JavaScript front end handles the search form, budget tiers, and results rendering, while a Vercel-hosted serverless API layer (/api/search and /api/photo) queries the Google Places API for nearby restaurants and proxies their photos, keeping API keys off the client. The interface is fully localized in English, Spanish, and Arabic, with automatic right-to-left layout for Arabic.",
          technologies: ["HTML5", "CSS3", "JavaScript (Vanilla)", "Google Places API", "Vercel Serverless Functions", "Vercel Hosting", "Google Fonts"],
          languages: ["English", "Spanish", "Arabic (RTL)"],
          features: [
            "Search restaurants using ZIP code",
            "Budget-based filtering across four price tiers",
            "Fast and intuitive interface",
            "Responsive, modern UI",
            "Multilingual support (English, Spanish, Arabic)",
            "Mobile-friendly, fully responsive design"
          ],
          skillsDemonstrated: ["Front-end UI/UX design", "API integration (Google Places)", "Serverless backend development", "Internationalization and RTL layout", "Responsive, mobile-first design", "Deployment on Vercel"],
          screenshots: [
            { id: "shot-1", caption: "PorchLight home - ZIP code and budget search", src: "assets/projects/porchlight/porchlight-home.png" },
            { id: "shot-2", caption: "Search results - nearby restaurants matching budget", src: "assets/projects/porchlight/porchlight-results.png" },
            { id: "shot-3", caption: "Spanish language interface", src: "assets/projects/porchlight/porchlight-spanish.png" },
            { id: "shot-4", caption: "Arabic interface with right-to-left layout", src: "assets/projects/porchlight/porchlight-arabic-rtl.png" }
          ],
          lessonsLearned: [
            "Narrowing the input to just a ZIP code and a budget removes decision fatigue and gets users to results faster than filter-heavy apps.",
            "Proxying third-party API calls through serverless functions keeps API keys secure while still serving live data.",
            "Building full right-to-left support from the start made the Arabic experience feel native rather than mirrored."
          ]
   }
   ];

const FUTURE_PROJECTS = [
   {
          id: "sentinel-soc-lab",
          name: "Microsoft Sentinel SOC Lab",
          tagline: "A simulated SOC environment built around Microsoft Sentinel.",
          status: "Planned",
          summary: "A future lab focused on Sentinel analytics rules, workbooks, and end-to-end alert triage in a simulated SOC environment."
   },
   {
          id: "azure-security-lab",
          name: "Azure Security Lab",
          tagline: "Applying cloud security fundamentals within Microsoft Azure.",
          status: "Planned",
          summary: "A future lab exploring Azure identity, network security, and Defender for Cloud, mirroring the AWS platform's approach."
   },
   {
          id: "threat-hunting-lab",
          name: "Threat Hunting Lab",
          tagline: "Proactive, hypothesis-driven threat hunting exercises.",
          status: "Planned",
          summary: "A future lab practicing hypothesis-driven threat hunting using KQL and MITRE ATT&CK-mapped scenarios."
   },
   {
          id: "detection-engineering-lab",
          name: "Detection Engineering Lab",
          tagline: "Building and tuning custom detection rules.",
          status: "Planned",
          summary: "A future lab focused on writing, testing, and tuning custom detection content to reduce false positives."
   },
   {
          id: "active-directory-lab",
          name: "Active Directory Lab",
          tagline: "Hardening and attacking a simulated AD environment.",
          status: "Planned",
          summary: "A future lab covering AD hardening, common attack paths, and detection strategies in a controlled lab environment."
   },
   {
          id: "cloud-incident-response-lab",
          name: "Cloud Incident Response Lab",
          tagline: "End-to-end incident response in a cloud environment.",
          status: "Planned",
          summary: "A future lab simulating a full incident response lifecycle in the cloud, from detection through containment and lessons learned."
   }
   ];

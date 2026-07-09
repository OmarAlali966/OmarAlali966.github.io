/* ============================================================
   SITE CONFIGURATION
   ------------------------------------------------------------
   Single source of truth for site-wide info: identity, bio,
   contact links, resume, and dashboard stats.

   HOW TO UPDATE:
   - Change any value below. No HTML/CSS editing required.
   - Fields marked "placeholder" are safe to fill in later.
   ============================================================ */

const SITE_CONFIG = {
    name: "Omar Alali",
    initials: "OA",
    headline: "Cybersecurity Graduate",
    tagline: "Cybersecurity Graduate | Cloud Security | AWS | SOC Analyst",

    targetRoles: [
          "Cloud Security Engineer",
          "Security Engineer",
          "SOC Analyst"
        ],

    summary: "Cybersecurity graduate from Florida International University (FIU), building toward a career in cloud security. I enjoy building hands-on cloud security projects on AWS and continuously sharpening practical, real-world security skills.",

    education: {
          school: "Florida International University (FIU)",
          degree: "B.S., Cybersecurity",
          location: "Miami, FL"
    },

    social: {
          github: "https://github.com/OmarAlali966",
          linkedin: "https://linkedin.com/in/omar-alali-93034b321",
          linkedinIsPlaceholder: false,
          email: "your.email@example.com", // TODO: Update with your real email
          emailIsPlaceholder: true
    },

    resume: {
          // Set to true once you upload a real PDF at the path below.
      available: false,
          fileUrl: "assets/resume.pdf"
    },

    // Shown on the animated Home/Security Lab dashboards.
    // Update these numbers as your experience grows.
    dashboard: {
          projectsCompleted: 1,
          projectsInProgress: 1,
          certifications: 4,
          certificationsInProgress: 1,
          certificationsPlanned: 1,
          cloudServicesUsed: 9,
          securityTechnologies: 12,
          hoursHandsOn: 250,
          githubRepos: 2
    }
};

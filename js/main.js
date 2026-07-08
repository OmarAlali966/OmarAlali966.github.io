/* ============================================================
   MAIN.JS \u2014 Shared behavior for every page
   Nav, animations, and data-driven rendering.
   Loaded after js/data/*.js on every page.
   ============================================================ */

(function () {
    "use strict";

   /* ---------- helpers ---------- */
   const qs = (sel, ctx) => (ctx || document).querySelector(sel);
    const qsa = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
    const el = (tag, className, html) => {
          const node = document.createElement(tag);
          if (className) node.className = className;
          if (html !== undefined) node.innerHTML = html;
          return node;
    };
    const escapeHtml = (str) => String(str).replace(/[&<>"']/g, (c) => ({
          "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));

   /* ---------- Mobile nav ---------- */
   function initNav() {
         const toggle = qs(".nav-toggle");
         const menu = qs(".mobile-menu");
         if (toggle && menu) {
                 toggle.addEventListener("click", () => menu.classList.toggle("open"));
                 qsa("a", menu).forEach((a) => a.addEventListener("click", () => menu.classList.remove("open")));
         }
         const path = window.location.pathname.split("/").pop() || "index.html";
         qsa(".nav-links a, .mobile-menu a").forEach((a) => {
                 const href = a.getAttribute("href");
                 if (href === path || (path === "" && href === "index.html")) a.classList.add("active");
         });
   }

   /* ---------- Scroll reveal ---------- */
   function initReveal() {
         const targets = qsa(".reveal");
         if (!targets.length) return;
         const io = new IntersectionObserver((entries) => {
                 entries.forEach((entry) => {
                           if (entry.isIntersecting) {
                                       entry.target.classList.add("in-view");
                                       io.unobserve(entry.target);
                           }
                 });
         }, { threshold: 0.15 });
         targets.forEach((t) => io.observe(t));
   }

   /* ---------- Animated counters ---------- */
   function initCounters() {
         const counters = qsa("[data-counter]");
         if (!counters.length) return;
         const io = new IntersectionObserver((entries) => {
                 entries.forEach((entry) => {
                           if (!entry.isIntersecting) return;
                           const node = entry.target;
                           const target = parseInt(node.getAttribute("data-counter"), 10) || 0;
                           const suffix = node.getAttribute("data-suffix") || "";
                           const duration = 1400;
                           const start = performance.now();
                           function tick(now) {
                                       const progress = Math.min((now - start) / duration, 1);
                                       const eased = 1 - Math.pow(1 - progress, 3);
                                       node.textContent = Math.round(eased * target) + suffix;
                                       if (progress < 1) requestAnimationFrame(tick);
                           }
                           requestAnimationFrame(tick);
                           io.unobserve(node);
                 });
         }, { threshold: 0.4 });
         counters.forEach((c) => io.observe(c));
   }

   /* ---------- Animated network / cloud canvas background ---------- */
   function initNetworkCanvas() {
         const canvas = qs("#network-canvas");
         if (!canvas) return;
         const ctx = canvas.getContext("2d");
         let w, h, nodes, animId;
         const NODE_COUNT = 60;
         const LINK_DIST = 150;

      function resize() {
              w = canvas.width = window.innerWidth;
              h = canvas.height = Math.max(window.innerHeight, document.body.scrollHeight * 0.6);
      }

      function makeNodes() {
              nodes = [];
              for (let i = 0; i < NODE_COUNT; i++) {
                        nodes.push({
                                    x: Math.random() * w,
                                    y: Math.random() * h,
                                    vx: (Math.random() - 0.5) * 0.25,
                                    vy: (Math.random() - 0.5) * 0.25,
                                    r: Math.random() * 1.6 + 0.6,
                                    pulse: Math.random() * Math.PI * 2
                        });
              }
      }

      function step() {
              ctx.clearRect(0, 0, w, h);
              for (const n of nodes) {
                        n.x += n.vx;
                        n.y += n.vy;
                        if (n.x < 0 || n.x > w) n.vx *= -1;
                        if (n.y < 0 || n.y > h) n.vy *= -1;
                        n.pulse += 0.02;
              }
              for (let i = 0; i < nodes.length; i++) {
                        for (let j = i + 1; j < nodes.length; j++) {
                                    const a = nodes[i], b = nodes[j];
                                    const dx = a.x - b.x, dy = a.y - b.y;
                                    const dist = Math.sqrt(dx * dx + dy * dy);
                                    if (dist < LINK_DIST) {
                                                  const alpha = (1 - dist / LINK_DIST) * 0.25;
                                                  ctx.strokeStyle = "rgba(10,132,255," + alpha + ")";
                                                  ctx.lineWidth = 1;
                                                  ctx.beginPath();
                                                  ctx.moveTo(a.x, a.y);
                                                  ctx.lineTo(b.x, b.y);
                                                  ctx.stroke();
                                    }
                        }
              }
              for (const n of nodes) {
                        const glow = 0.5 + Math.sin(n.pulse) * 0.3;
                        ctx.beginPath();
                        ctx.arc(n.x, n.y, n.r + 1.2, 0, Math.PI * 2);
                        ctx.fillStyle = "rgba(34,211,238," + glow * 0.5 + ")";
                        ctx.fill();
                        ctx.beginPath();
                        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
                        ctx.fillStyle = "rgba(150,210,255,0.9)";
                        ctx.fill();
              }
              animId = requestAnimationFrame(step);
      }

      resize();
         makeNodes();
         step();

      let resizeTimer;
         window.addEventListener("resize", () => {
                 clearTimeout(resizeTimer);
                 resizeTimer = setTimeout(() => {
                           cancelAnimationFrame(animId);
                           resize();
                           makeNodes();
                           step();
                 }, 250);
         });
   }

   /* ---------- Render: Certifications ---------- */
   function statusLabel(status) {
         if (status === "completed") return "Completed";
         if (status === "in-progress") return "In Progress";
         return "Planned";
   }

   function certCardHtml(cert) {
         const meta = cert.isPlaceholderDetails
           ? '<span class="placeholder-note">Details to be added</span>'
                 : "";
         return (
                 '<div class="cert-card reveal">' +
                   '<div class="cert-top">' +
                     '<div class="cert-logo">' + escapeHtml(cert.logo || "") + '</div>' +
                     '<div>' +
                       '<div class="cert-title">' + escapeHtml(cert.name) + '</div>' +
                       '<div class="cert-issuer">' + escapeHtml(cert.issuer) + '</div>' +
                     '</div>' +
                   '</div>' +
                   '<span class="status-pill status-' + cert.status + '">' + statusLabel(cert.status) + '</span>' +
                   '<div class="cert-meta">' +
                     '<div><span>Issue Date</span>' + escapeHtml(cert.issueDate) + '</div>' +
                     '<div><span>Credential ID</span>' + escapeHtml(cert.credentialId) + '</div>' +
                   '</div>' +
                   '<div class="cert-skills">' +
                     cert.skills.map((s) => '<span class="tag">' + escapeHtml(s) + '</span>').join("") +
                   '</div>' +
                   meta +
                   '<a class="cert-verify" href="' + escapeHtml(cert.verifyUrl) + '" target="_blank" rel="noopener">Verification Link &rarr;</a>' +
                 '</div>'
               );
   }

   function renderCertifications(selector, filterFn) {
         const container = qs(selector);
         if (!container || typeof CERTIFICATIONS === "undefined") return;
         const list = filterFn ? CERTIFICATIONS.filter(filterFn) : CERTIFICATIONS;
         container.innerHTML = list.map(certCardHtml).join("");
   }

   /* ---------- Render: Timeline ---------- */
   function timelineItemHtml(item) {
         return (
                 '<div class="timeline-item type-' + item.type + ' reveal">' +
                   '<div class="timeline-dot"></div>' +
                   '<div class="timeline-date">' + escapeHtml(item.date) + '</div>' +
                   '<h3>' + escapeHtml(item.title) + '</h3>' +
                   '<p>' + escapeHtml(item.description) + '</p>' +
                   '<span class="timeline-badge">' + escapeHtml(item.type) + '</span>' +
                 '</div>'
               );
   }

   function renderTimeline(selector) {
         const container = qs(selector);
         if (!container || typeof TIMELINE === "undefined") return;
         container.innerHTML = TIMELINE.map(timelineItemHtml).join("");
   }

   /* ---------- Render: Skills ---------- */
   const SKILL_ICONS = {
         cloud: "\u2601", shield: "\u26E8", code: "\u2328", terminal: ">_", network: "\u29C9"
   };

   function skillCardHtml(cat) {
         return (
                 '<div class="skill-card reveal">' +
                   '<h3><span>' + (SKILL_ICONS[cat.icon] || "\u25C6") + '</span>' + escapeHtml(cat.title) + '</h3>' +
                   '<div class="skill-tags">' +
                     cat.items.map((s) => '<span class="tag">' + escapeHtml(s) + '</span>').join("") +
                   '</div>' +
                 '</div>'
               );
   }

   function renderSkills(selector) {
         const container = qs(selector);
         if (!container || typeof SKILLS === "undefined") return;
         container.innerHTML = SKILLS.map(skillCardHtml).join("");
   }

   /* ---------- Render: Projects ---------- */
   function featuredProjectCardHtml(p) {
         return (
                 '<div class="project-card reveal">' +
                   '<div class="project-media"><div class="grid-lines"></div><span class="media-label">Featured Project</span></div>' +
                   '<div class="project-body">' +
                     '<h3>' + escapeHtml(p.name) + '</h3>' +
                     '<p>' + escapeHtml(p.tagline) + '</p>' +
                     '<div class="project-tech">' +
                       p.technologies.slice(0, 6).map((t) => '<span class="tag">' + escapeHtml(t) + '</span>').join("") +
                     '</div>' +
                     '<div class="project-links">' +
                       '<a href="project-aws-security.html">View Project &rarr;</a>' +
                       '<a href="' + escapeHtml(p.githubUrl) + '" target="_blank" rel="noopener">GitHub &rarr;</a>' +
                     '</div>' +
                   '</div>' +
                 '</div>'
               );
   }

   function futureProjectCardHtml(p) {
         return (
                 '<div class="future-card reveal">' +
                   '<span class="status-pill status-planned">' + escapeHtml(p.status) + '</span>' +
                   '<h4 class="mt-16">' + escapeHtml(p.name) + '</h4>' +
                   '<p>' + escapeHtml(p.summary) + '</p>' +
                 '</div>'
               );
   }

   function renderFeaturedProjects(selector) {
         const container = qs(selector);
         if (!container || typeof FEATURED_PROJECTS === "undefined") return;
         container.innerHTML = FEATURED_PROJECTS.map(featuredProjectCardHtml).join("");
   }

   function renderFutureProjects(selector) {
         const container = qs(selector);
         if (!container || typeof FUTURE_PROJECTS === "undefined") return;
         container.innerHTML = FUTURE_PROJECTS.map(futureProjectCardHtml).join("");
   }

   function renderProjectDetail(selector, projectId) {
         const container = qs(selector);
         if (!container || typeof FEATURED_PROJECTS === "undefined") return;
         const p = FEATURED_PROJECTS.find((proj) => proj.id === projectId);
         if (!p) return;
         container.innerHTML =
                 '<div class="reveal">' +
                   '<span class="kicker">Featured Project</span>' +
                   '<h1 style="font-size:clamp(30px,5vw,48px);font-weight:700;letter-spacing:-1px;">' + escapeHtml(p.name) + '</h1>' +
                   '<p style="margin-top:14px;color:var(--text-muted);font-size:17px;max-width:700px;">' + escapeHtml(p.tagline) + '</p>' +
                   '<div class="btn-row mt-24">' +
                     '<a class="btn btn-primary" href="' + escapeHtml(p.githubUrl) + '" target="_blank" rel="noopener">View on GitHub</a>' +
                     '<a class="btn btn-secondary" href="' + escapeHtml(p.documentationUrl) + '" target="_blank" rel="noopener">Documentation</a>' +
                   '</div>' +
                 '</div>' +
                 '<div class="grid grid-2 mt-40">' +
                   '<div class="card reveal"><h3>Overview</h3><p class="mt-16">' + escapeHtml(p.overview) + '</p></div>' +
                   '<div class="card reveal"><h3>Architecture</h3><p class="mt-16">' + escapeHtml(p.architecture) + '</p></div>' +
                 '</div>' +
                 '<div class="card reveal mt-24"><h3>Technologies</h3><div class="project-tech mt-16">' +
                   p.technologies.map((t) => '<span class="tag">' + escapeHtml(t) + '</span>').join("") +
                 '</div></div>' +
                 '<div class="section-head left mt-40"><span class="kicker">Gallery</span><h2>Screenshots</h2></div>' +
                 '<div class="grid grid-2">' +
                   p.screenshots.map((s) =>
                               '<div class="project-media reveal" style="border-radius:18px;"><div class="grid-lines"></div><span class="media-label">' + escapeHtml(s.caption) + '</span></div>'
                                             ).join("") +
                 '</div>' +
                 '<div class="card reveal mt-40"><h3>Lessons Learned</h3><ul class="mt-16" style="display:grid;gap:12px;">' +
                   p.lessonsLearned.map((l) => '<li style="padding-left:22px;position:relative;color:var(--text-muted);">' +
                               '<span style="position:absolute;left:0;color:var(--blue-light);">&#10148;</span>' + escapeHtml(l) + '</li>').join("") +
                 '</ul></div>';
   }

   /* ---------- Render: Dashboard stats ---------- */
   function renderDashboard(selector) {
         const container = qs(selector);
         if (!container || typeof SITE_CONFIG === "undefined") return;
         const d = SITE_CONFIG.dashboard;
         const stats = [
           { label: "Projects Completed", value: d.projectsCompleted },
           { label: "Projects In Progress", value: d.projectsInProgress },
           { label: "Certifications Earned", value: d.certifications },
           { label: "Cloud Services Used", value: d.cloudServicesUsed },
           { label: "Security Technologies", value: d.securityTechnologies },
           { label: "Hours Hands-On Practice", value: d.hoursHandsOn, suffix: "+" },
           { label: "GitHub Repositories", value: d.githubRepos }
               ];
         container.innerHTML = stats.map((s) =>
                 '<div class="stat-card reveal">' +
                   '<div class="stat-value" data-counter="' + s.value + '" data-suffix="' + (s.suffix || "") + '">0</div>' +
                   '<div class="stat-label">' + escapeHtml(s.label) + '</div>' +
                 '</div>'
                                             ).join("");
   }

   /* ---------- Apply SITE_CONFIG to [data-config] elements ---------- */
   function applySiteConfig() {
         if (typeof SITE_CONFIG === "undefined") return;
         qsa("[data-config]").forEach((node) => {
                 const path = node.getAttribute("data-config").split(".");
                 let value = SITE_CONFIG;
                 for (const key of path) value = value && value[key];
                 if (value === undefined || value === null) return;
                 if (node.hasAttribute("data-config-href")) {
                           node.setAttribute("href", value);
                 } else {
                           node.textContent = value;
                 }
         });
         // Resume buttons: disable if no resume uploaded yet
      if (SITE_CONFIG.resume && !SITE_CONFIG.resume.available) {
              qsa("[data-resume-link]").forEach((btn) => {
                        btn.setAttribute("aria-disabled", "true");
                        btn.classList.add("btn-ghost");
                        btn.removeAttribute("href");
                        btn.style.cursor = "not-allowed";
              });
      } else if (SITE_CONFIG.resume) {
              qsa("[data-resume-link]").forEach((btn) => {
                        btn.setAttribute("href", SITE_CONFIG.resume.fileUrl);
              });
      }
   }

   /* ---------- Init ---------- */
   document.addEventListener("DOMContentLoaded", () => {
         initNav();
         initNetworkCanvas();
         applySiteConfig();
         renderCertifications("#certGrid");
         renderCertifications("#homeCertPreview", (c) => c.status === "completed");
         renderTimeline("#timelineList");
         renderSkills("#skillsGrid");
         renderFeaturedProjects("#featuredProjectsGrid");
         renderFutureProjects("#futureProjectsGrid");
         renderDashboard("#dashboardGrid");
         renderDashboard("#labDashboardGrid");
         if (qs("#projectDetail")) {
                 renderProjectDetail("#projectDetail", "aws-enterprise-security-monitoring-platform");
         }
         initReveal();
         initCounters();
   });

   // Expose for pages that need direct access (e.g. contact form handlers)
   window.Portfolio = { qs, qsa, escapeHtml };
})();

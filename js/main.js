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

   /* ---------- Certifications ---------- */
   function statusLabel(status) {
          if (status === "completed") return "Completed";
          if (status === "in-progress") return "In Progress";
          return "Planned";
   }

   function certCardHtml(cert) {
          return (
                   '<div class="cert-card reveal">' +
                     '<div class="cert-top">' +
                       '<div class="cert-logo">' + escapeHtml(cert.logo || "") + '</div>' +
                       '<div>' +
                         '<div class="cert-title">' + escapeHtml(cert.shortName || cert.name) + '</div>' +
                         '<div class="cert-issuer">' + escapeHtml(cert.issuer) + '</div>' +
                       '</div>' +
                     '</div>' +
                     '<span class="status-pill status-' + cert.status + '">' + statusLabel(cert.status) + '</span>' +
                     '<div class="cert-skills">' +
                       cert.skills.slice(0, 4).map((s) => '<span class="tag">' + escapeHtml(s) + '</span>').join("") +
                     '</div>' +
                   '</div>'
                 );
   }

   function renderCertifications(selector, filterFn) {
          const container = qs(selector);
          if (!container || typeof CERTIFICATIONS === "undefined") return;
          const list = filterFn ? CERTIFICATIONS.filter(filterFn) : CERTIFICATIONS;
          container.innerHTML = list.map(certCardHtml).join("");
   }

   /* ---------- Certifications: full expandable cards ---------- */
   function certExpandableCardHtml(cert, idx) {
          const meta = cert.isPlaceholderDetails ? '<span class="placeholder-note">Some details are placeholders \u2014 update in js/data/certifications.js</span>' : "";
          return (
                   '<div class="cert-card reveal" style="--i:' + idx + '">' +
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
                       '<div><span>Expires</span>' + escapeHtml(cert.expirationDate || "N/A") + '</div>' +
                       '<div><span>Credential ID</span>' + escapeHtml(cert.credentialId) + '</div>' +
                       '<div><span>Issuer</span>' + escapeHtml(cert.issuer) + '</div>' +
                     '</div>' +
                     '<div class="cert-skills">' +
                       cert.skills.map((s) => '<span class="tag">' + escapeHtml(s) + '</span>').join("") +
                     '</div>' +
                     '<button class="btn btn-ghost cert-expand-toggle" type="button" style="width:fit-content;">View Details &darr;</button>' +
                     '<div class="cert-expand-panel" hidden>' +
                       '<h4 class="mt-16" style="font-size:14px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;">What I Learned</h4>' +
                       '<ul style="margin-top:10px;display:grid;gap:8px;">' +
                         (cert.whatLearned || []).map((w) => '<li style="padding-left:18px;position:relative;font-size:14px;color:var(--text-muted);"><span style="position:absolute;left:0;color:var(--blue-light);">&#10148;</span>' + escapeHtml(w) + '</li>').join("") +
                       '</ul>' +
                       '<h4 class="mt-16" style="font-size:14px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;">How I Applied It</h4>' +
                       '<p class="mt-8" style="font-size:14px;color:var(--text-muted);">' + escapeHtml(cert.howApplied || "") + '</p>' +
                       '<h4 class="mt-16" style="font-size:14px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;">Notes</h4>' +
                       '<p class="mt-8" style="font-size:14px;color:var(--text-muted);">' + escapeHtml(cert.notes || "") + '</p>' +
                     '</div>' +
                     meta +
                     '<div class="btn-row mt-8">' +
                       '<a class="btn btn-secondary" href="' + escapeHtml(cert.verifyUrl) + '" target="_blank" rel="noopener">Verify Credential</a>' +
                       '<a class="btn btn-ghost" href="' + escapeHtml(cert.officialUrl) + '" target="_blank" rel="noopener">Official Cert Page</a>' +
                     '</div>' +
                   '</div>'
                 );
   }

   function renderCertificationsFull(selector) {
          const container = qs(selector);
          if (!container || typeof CERTIFICATIONS === "undefined") return;
          container.innerHTML = CERTIFICATIONS.map(certExpandableCardHtml).join("");
          container.addEventListener("click", (e) => {
                   const btn = e.target.closest(".cert-expand-toggle");
                   if (!btn) return;
                   const card = btn.closest(".cert-card");
                   const panel = card.querySelector(".cert-expand-panel");
                   const isOpen = !panel.hidden;
                   panel.hidden = isOpen;
                   btn.innerHTML = isOpen ? "View Details &darr;" : "Hide Details &uarr;";
          });
   }

   /* ---------- Timeline ---------- */
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

   /* ---------- Skills ---------- */
   const SKILL_ICONS = {
          cloud: "", shield: "", code: "", terminal: ">_", network: "\u29C9"
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

   /* ---------- Projects ---------- */
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
                         '<a href="project-aws-security.html">View Case Study &rarr;</a>' +
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

   function listBlock(title, items) {
          return (
                   '<div class="card reveal mt-24"><h3>' + title + '</h3><ul class="mt-16" style="display:grid;gap:12px;">' +
                     (items || []).map((l) => '<li style="padding-left:22px;position:relative;color:var(--text-muted);">' +
                                  '<span style="position:absolute;left:0;color:var(--blue-light);">&#10148;</span>' + escapeHtml(l) + '</li>').join("") +
                   '</ul></div>'
                 );
   }

   function renderProjectDetail(selector, projectId) {
          const container = qs(selector);
          if (!container || typeof FEATURED_PROJECTS === "undefined") return;
          const p = FEATURED_PROJECTS.find((proj) => proj.id === projectId);
          if (!p) return;
          container.innerHTML =
                   '<div class="reveal">' +
                     '<span class="kicker">Featured Project \u00b7 Case Study</span>' +
                     '<h1 style="font-size:clamp(30px,5vw,48px);font-weight:700;letter-spacing:-1px;">' + escapeHtml(p.name) + '</h1>' +
                     '<p style="margin-top:14px;color:var(--text-muted);font-size:17px;max-width:700px;">' + escapeHtml(p.tagline) + '</p>' +
                     '<div class="btn-row mt-24">' +
                       '<a class="btn btn-primary" href="' + escapeHtml(p.githubUrl) + '" target="_blank" rel="noopener">View on GitHub</a>' +
                       '<a class="btn btn-secondary" href="' + escapeHtml(p.documentationUrl) + '" target="_blank" rel="noopener">Documentation</a>' +
                     '</div>' +
                   '</div>' +
                   '<div class="grid grid-2 mt-40">' +
                     '<div class="card reveal"><h3>Problem</h3><p class="mt-16">' + escapeHtml(p.problem || "") + '</p></div>' +
                     '<div class="card reveal"><h3>Solution</h3><p class="mt-16">' + escapeHtml(p.solution || "") + '</p></div>' +
                   '</div>' +
                   '<div class="grid grid-2 mt-24">' +
                     '<div class="card reveal"><h3>Overview</h3><p class="mt-16">' + escapeHtml(p.overview) + '</p></div>' +
                     '<div class="card reveal"><h3>Architecture</h3><p class="mt-16">' + escapeHtml(p.architecture) + '</p></div>' +
                   '</div>' +
                   '<div class="section-head left mt-40"><span class="kicker">Architecture</span><h2>Architecture Diagram</h2></div>' + '<div class="project-media reveal" style="border-radius:18px;aspect-ratio:16/7;"><div class="grid-lines"></div><span class="media-label">Architecture diagram \u2014 coming soon</span></div>' + '<div class="card reveal mt-24"><h3>Technologies Used</h3><div class="project-tech mt-16">' +
                     p.technologies.map((t) => '<span class="tag">' + escapeHtml(t) + '</span>').join("") +
                   '</div></div>' +
                   '<div class="section-head left mt-40"><span class="kicker">Gallery</span><h2>Screenshots</h2></div>' +
                   '<div class="grid grid-2">' +
                     p.screenshots.map((s) =>
                                  '<div class="project-media reveal" style="border-radius:18px;"><div class="grid-lines"></div><span class="media-label">' + escapeHtml(s.caption) + '</span></div>'
                                               ).join("") +
                   '</div>' +
                   listBlock("Skills Demonstrated", p.skillsDemonstrated) +
                   listBlock("Lessons Learned", p.lessonsLearned);
   }

   /* ---------- Dashboard stats ---------- */
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

/* ---------- Learning Platforms ---------- */
   function progressBarHtml(pct) {
      var v = Math.max(0, Math.min(100, pct || 0));
      return '<div class="progress-track"><div class="progress-fill" style="width:' + v + '%;"></div></div><span class="progress-pct">' + v + '%</span>';
   }

   function pathStatusBadge(status) {
      if (status === "completed") return '<span class="status-badge status-completed">&#10003; Completed</span>';
      if (status === "in-progress") return '<span class="status-badge status-inprogress">In Progress</span>';
      return '<span class="status-badge status-learning">Currently Learning</span>';
   }

   function learningPathCardHtml(path) {
      var whatLearnedHtml = (path.status === "completed" && path.whatLearned && path.whatLearned.length)
      ? '<div class="what-learned mt-16"><h5>What I Learned</h5><ul>' +
         path.whatLearned.map((w) => '<li>' + escapeHtml(w) + '</li>').join("") +
         '</ul></div>'
         : '';
      return (
         '<div class="path-card reveal">' +
         '<div class="path-card-head">' +
         '<h4>' + escapeHtml(path.title) + '</h4>' +
         pathStatusBadge(path.status) +
         '</div>' +
         '<div class="path-meta mt-16"><span class="difficulty-tag">' + escapeHtml(path.difficulty || "Difficulty coming soon") + '</span></div>' +
         '<p class="path-desc mt-16">' + escapeHtml(path.summary || "") + '</p>' +
         '<div class="progress-row mt-16">' + progressBarHtml(path.progress) + '</div>' +
         whatLearnedHtml +
         '</div>'
         );
   }

   function pathSectionHtml(title, paths) {
      if (!paths || !paths.length) return "";
      return (
         '<div class="section-head left mt-40"><span class="kicker">Hands-on Progress</span><h2>' + title + '</h2></div>' +
         '<div class="grid grid-3">' + paths.map(learningPathCardHtml).join("") + '</div>'
         );
   }

   function certificatesBlockHtml(certs) {
      if (!certs || !certs.length) {
         return '<div class="card reveal mt-24"><h3>Certificates</h3><p class="mt-16" style="color:var(--text-muted);">Add certificates as you earn them.</p></div>';
      }
      return (
         '<div class="card reveal mt-24"><h3>Certificates</h3><div class="btn-row mt-16">' +
         certs.map((c) => '<a class="btn btn-secondary" href="' + escapeHtml(c.url) + '" target="_blank" rel="noopener">' + escapeHtml(c.title) + '</a>').join("") +
         '</div></div>'
         );
   }

   function platformStatsLabel(p) {
      var completed = (p.completedPaths || []).length;
      var inProgress = (p.inProgressPaths || []).length;
      var learning = (p.currentlyLearning || []).length;
      var parts = [];
      if (completed) parts.push(completed + (completed === 1 ? " Path Completed" : " Paths Completed"));
      if (inProgress) parts.push(inProgress + " In Progress");
      if (learning) parts.push(learning + " Currently Learning");
      return parts.length ? parts.join(" \u00b7 ") : "New platform \u2014 paths coming soon";
   }

   function learningPlatformCardHtml(p) {
      return (
         '<div class="card reveal">' +
         '<div class="cert-top">' +
         '<div class="cert-logo">' + escapeHtml(p.logo) + '</div>' +
         '<div><div class="cert-title">' + escapeHtml(p.name) + '</div></div>' +
         '</div>' +
         '<p class="mt-16" style="color:var(--text-muted);font-size:14.5px;">' + escapeHtml(p.description) + '</p>' +
         '<div class="mt-16" style="font-size:13px;color:var(--text-faint);">' + escapeHtml(platformStatsLabel(p)) + '</div>' +
         '<div class="btn-row mt-24">' +
         '<a class="btn btn-secondary" href="learning-platform.html?id=' + encodeURIComponent(p.id) + '">View Details</a>' +
         '<a class="btn btn-ghost" href="' + escapeHtml(p.profileUrl) + '" target="_blank" rel="noopener">Visit Profile</a>' +
         '</div>' +
         '</div>'
         );
   }

   function renderLearningPlatforms(selector) {
      const container = qs(selector);
      if (!container || typeof LEARNING_PLATFORMS === "undefined") return;
      container.innerHTML = LEARNING_PLATFORMS.map(learningPlatformCardHtml).join("");
   }

   function renderLearningPlatformDetail(selector) {
      const container = qs(selector);
      if (!container || typeof LEARNING_PLATFORMS === "undefined") return;
      const params = new URLSearchParams(window.location.search);
      const id = params.get("id") || (LEARNING_PLATFORMS[0] && LEARNING_PLATFORMS[0].id);
      const p = LEARNING_PLATFORMS.find((pl) => pl.id === id) || LEARNING_PLATFORMS[0];
      if (!p) return;
      document.title = p.name + " | Omar Alali";
      const hasAnyPaths = (p.completedPaths && p.completedPaths.length) || (p.inProgressPaths && p.inProgressPaths.length) || (p.currentlyLearning && p.currentlyLearning.length);
      container.innerHTML =
         '<div class="reveal">' +
         '<span class="kicker">Hands-on Lab</span>' +
         '<div class="cert-top" style="margin-top:14px;">' +
         '<div class="cert-logo" style="width:64px;height:64px;font-size:15px;">' + escapeHtml(p.logo) + '</div>' +
         '<h1 style="font-size:clamp(28px,5vw,42px);font-weight:700;letter-spacing:-1px;">' + escapeHtml(p.name) + '</h1>' +
         '</div>' +
         '<p style="margin-top:14px;color:var(--text-muted);font-size:17px;max-width:700px;">' + escapeHtml(p.description) + '</p>' +
         '<div class="btn-row mt-24">' +
         '<a class="btn btn-primary" href="' + escapeHtml(p.profileUrl) + '" target="_blank" rel="noopener">Visit My ' + escapeHtml(p.name) + ' Profile</a>' +
         '<a class="btn btn-secondary" href="learning-platforms.html">All Platforms</a>' +
         '</div>' +
         '</div>' +
         '<div class="card reveal mt-40"><h3>Progress Overview</h3><p class="mt-16">' + escapeHtml(platformStatsLabel(p)) + '</p></div>' +
         (hasAnyPaths ? "" : '<div class="card reveal mt-24"><p style="color:var(--text-muted);">Learning paths for this platform are coming soon.</p></div>') +
         pathSectionHtml("Completed Learning Paths", p.completedPaths) +
         pathSectionHtml("In Progress", p.inProgressPaths) +
         pathSectionHtml("Currently Learning", p.currentlyLearning) +
         certificatesBlockHtml(p.certificates) +
         '<div class="section-head left mt-40"><span class="kicker">Gallery</span><h2>Screenshots</h2></div>' +
         '<div class="grid grid-2">' +
         (p.screenshots || []).map((s) =>
            '<div class="project-media reveal" style="border-radius:18px;"><div class="grid-lines"></div><span class="media-label">' + escapeHtml(s.caption) + '</span></div>'
            ).join("") +
         '</div>' +
         '<div class="card reveal mt-24"><h3>Skills Gained</h3><div class="project-tech mt-16">' +
         (p.skillsGained || []).map((t) => '<span class="tag">' + escapeHtml(t) + '</span>').join("") +
         '</div></div>' +
         '<div class="card reveal mt-24"><h3>Notes</h3><p class="mt-16">' + escapeHtml(p.notes || "") + '</p></div>';
   }

   /* ---------- Roadmap ---------- */
   function roadmapIcon(status) {
          if (status === "done") return "&#10003;";
          if (status === "in-progress") return "&#8635;";
          return "&#9679;";
   }

   function roadmapItemHtml(item) {
          const dateHtml = item.status === "done" && item.completionDate
            ? '<span class="timeline-badge">Completed \u00b7 ' + escapeHtml(item.completionDate) + '</span>'
                   : '<span class="timeline-badge">' + (item.status === "in-progress" ? "In Progress" : "Planned") + '</span>';
          return (
                   '<div class="timeline-item type-' + (item.status === "done" ? "cert" : item.status === "in-progress" ? "project" : "future") + ' reveal">' +
                     '<div class="timeline-dot">' +
                     '</div>' +
                     '<div class="timeline-date">' + roadmapIcon(item.status) + ' &nbsp;' + escapeHtml(item.category.toUpperCase()) + '</div>' +
                     '<h3>' + escapeHtml(item.title) + '</h3>' +
                     dateHtml +
                   '</div>'
                 );
   }

   function renderRoadmap(selector) {
          const container = qs(selector);
          if (!container || typeof ROADMAP === "undefined") return;
          container.innerHTML = ROADMAP.map(roadmapItemHtml).join("");
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
               qsa(".resume-note").forEach((note) => { note.hidden = true; });
          }
   }

   /* ---------- Init ---------- */
   document.addEventListener("DOMContentLoaded", () => {
          initNav();
          initNetworkCanvas();
          applySiteConfig();
          renderCertifications("#homeCertPreview", (c) => c.status === "completed");
          renderCertificationsFull("#certGrid");
          renderTimeline("#timelineList");
          renderSkills("#skillsGrid");
          renderFeaturedProjects("#featuredProjectsGrid");
          renderFutureProjects("#futureProjectsGrid");
          renderDashboard("#dashboardGrid");          
          renderLearningPlatforms("#learningPlatformsGrid");
          renderLearningPlatformDetail("#learningPlatformDetail");
          renderRoadmap("#roadmapList");
if (qs("#projectDetail")) {
   renderProjectDetail("#projectDetail", "aws-enterprise-security-monitoring-platform");
          }
          initReveal();
          initCounters();
   });

   window.Portfolio = { qs, qsa, escapeHtml };
})();

/* ----------- Contact links (self-contained, data-driven) ----------- */
(function () {
     "use strict";
     function renderContactLinks(selector) {
            var container = document.querySelector(selector);
            if (!container || typeof SITE_CONFIG === "undefined") return;
            var s = SITE_CONFIG.social;
            var cards = [
               { label: "Phone", value: s.phoneIsPlaceholder ? "Coming soon — will be added shortly" : s.phone, href: s.phoneIsPlaceholder ? "#" : ("tel:" + s.phoneDial), external: false, cta: "Call Me" },
               { label: "Email", value: s.emailIsPlaceholder ? "Coming soon — will be added shortly" : s.email, href: s.emailIsPlaceholder ? "#" : ("mailto:" + s.email), external: false, cta: "Send Email" },
               { label: "LinkedIn", value: s.linkedinIsPlaceholder ? "Coming soon — will be added shortly" : s.linkedin, href: s.linkedinIsPlaceholder ? "#" : s.linkedin, external: true, cta: "View LinkedIn" }
                       ];
                container.innerHTML = cards.map(function (c) {
                             var attrs = c.external ? ' target="_blank" rel="noopener noreferrer"' : "";
                             return (
                                            '<a class="contact-card" href="' + c.href + '"' + attrs + '>' +
                                            '<div class="contact-card-body"><h4>' + c.label + '</h4><span class="contact-card-value">' + c.value + '</span></div>' +
                                            '<span class="contact-card-cta">' + c.cta + '</span></a>'
                                          );
            }).join("");
     }
     document.addEventListener("DOMContentLoaded", function () {
            renderContactLinks("#contactCards");
     });
})();

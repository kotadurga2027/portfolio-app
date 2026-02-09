const API_BASE = "https://portfolio-backend-bf4r.onrender.com/api";

const qs = (selector, root = document) => root.querySelector(selector);
const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function safeText(value, fallback = "") {
  if (value === null || value === undefined) return fallback;
  return String(value);
}

function esc(value) {
  return safeText(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function fetchJSON(path, options) {
  const res = await fetch(`${API_BASE}${path}`, options);
  if (!res.ok) throw new Error(`Request failed: ${path} (${res.status})`);
  return res.json();
}

function formatDate(dateValue) {
  if (!dateValue) return "";
  const dt = new Date(dateValue);
  if (Number.isNaN(dt.getTime())) return safeText(dateValue);
  return dt.toLocaleDateString();
}

function getProjectId(project) {
  return project.id || project._id || project.title || Math.random().toString(36).slice(2);
}

function getProjectLikeId(project) {
  return project._id || project.id || project.title;
}

function getProjectTags(project) {
  if (Array.isArray(project.tags) && project.tags.length) return project.tags;
  if (Array.isArray(project.techStack) && project.techStack.length) return project.techStack;
  return [];
}

function getProjectGithub(project) {
  return project.github || project.githubLink || "#";
}

function showToast(message, type = "success") {
  let holder = qs(".toast-holder");
  if (!holder) {
    holder = document.createElement("div");
    holder.className = "toast-holder";
    document.body.appendChild(holder);
  }

  const toast = document.createElement("div");
  toast.className = `toast-item ${type}`;
  toast.textContent = safeText(message);
  holder.appendChild(toast);

  setTimeout(() => toast.classList.add("show"), 10);
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 220);
  }, 2200);
}

function applyMobileNav() {
  const hamburger = qs("#hamburger");
  const navLinks = qs("#nav-links");
  if (!hamburger || !navLinks) return;

  let overlay = qs(".overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "overlay";
    document.body.appendChild(overlay);
  }

  const closeMenu = () => {
    navLinks.classList.remove("open");
    overlay.classList.remove("show");
  };

  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    overlay.classList.toggle("show");
  });

  overlay.addEventListener("click", closeMenu);
  qsa("a", navLinks).forEach((a) => a.addEventListener("click", closeMenu));
}

function applyBackToTop() {
  let backToTop = qs(".back-to-top");
  if (!backToTop) {
    backToTop = document.createElement("button");
    backToTop.className = "back-to-top";
    backToTop.setAttribute("aria-label", "Back to top");
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(backToTop);
  }

  const onScroll = () => {
    if (window.scrollY > 420) backToTop.classList.add("show");
    else backToTop.classList.remove("show");
  };

  window.addEventListener("scroll", onScroll);
  onScroll();

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function applyFloatingButtons() {
  let contactBtn = qs(".floating-contact");
  if (!contactBtn) {
    contactBtn = document.createElement("button");
    contactBtn.className = "floating-contact";
    contactBtn.setAttribute("aria-label", "Contact");
    contactBtn.setAttribute("data-label", "Contact");
    contactBtn.title = "Contact";
    contactBtn.innerHTML = '<i class="fas fa-envelope"></i>';
    document.body.appendChild(contactBtn);
  }

  let feedbackBtn = qs(".floating-feedback");
  if (!feedbackBtn) {
    feedbackBtn = document.createElement("button");
    feedbackBtn.className = "floating-feedback";
    feedbackBtn.setAttribute("aria-label", "Feedback");
    feedbackBtn.setAttribute("data-label", "Feedback");
    feedbackBtn.title = "Feedback";
    feedbackBtn.innerHTML = '<i class="fas fa-comment-dots"></i>';
    document.body.appendChild(feedbackBtn);
  }

  contactBtn.addEventListener("click", () => {
    window.location.href = "contact.html";
  });

  feedbackBtn.addEventListener("click", () => {
    const feedbackSection = qs("#feedback");
    if (feedbackSection) {
      feedbackSection.classList.remove("feedback-hidden");
      feedbackSection.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    window.location.href = "index.html#feedback";
  });
}

function updateStat(id, value) {
  const el = qs(`#${id}`);
  if (!el || value === undefined || value === null) return;
  const num = Number(value);
  el.textContent = Number.isFinite(num) ? `${num}+` : safeText(value);
}

async function loadStats() {
  if (!qs("#yearsExperience") && !qs("#projectCount")) return;

  try {
    const data = await fetchJSON("/stats");
    updateStat("yearsExperience", data.yearsExperience);
    updateStat("projectCount", data.projects);
    updateStat("cicdPipelines", data.cicdPipelines);
    updateStat("technologiesCount", data.technologies);
  } catch (err) {
    console.error("Stats load error:", err);
  }
}

function renderExperience(items = []) {
  const timeline = qs("#experienceTimeline");
  if (!timeline) return;

  if (!Array.isArray(items) || items.length === 0) {
    timeline.innerHTML = '<p class="section-empty">Experience data not available.</p>';
    return;
  }

  timeline.innerHTML = items
    .map((exp, idx) => {
      const summary = Array.isArray(exp.description)
        ? safeText(exp.description[0])
        : safeText(exp.description || exp.responsibilities?.[0] || "");
      return `
        <article class="timeline-item" data-exp-index="${idx}">
          <div class="timeline-marker"></div>
          <div class="timeline-content">
            <div class="timeline-header">
              <h3>${esc(exp.title || "Role")}</h3>
              <span class="timeline-date">${esc(exp.period || "")}</span>
            </div>
            <p class="company">${esc(exp.company || "")}</p>
            <ul class="achievements">
              <li>${esc(summary)}</li>
            </ul>
          </div>
        </article>
      `;
    })
    .join("");

  setupExperiencePopup(items);
}

function setupExperiencePopup(items = []) {
  const timeline = qs("#experienceTimeline");
  if (!timeline) return;
  const timelineItems = qsa(".timeline-item", timeline);
  if (!timelineItems.length) return;

  let overlay = qs(".experience-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.className = "experience-overlay";
    overlay.innerHTML = `
      <div class="experience-popup" role="dialog" aria-modal="true">
        <button type="button" class="experience-popup-close" aria-label="Close experience details">
          <i class="fas fa-xmark"></i>
        </button>
        <h3 class="experience-popup-title"></h3>
        <p class="experience-popup-meta"></p>
        <ul class="experience-popup-list"></ul>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  const popup = qs(".experience-popup", overlay);
  const titleEl = qs(".experience-popup-title", overlay);
  const metaEl = qs(".experience-popup-meta", overlay);
  const listEl = qs(".experience-popup-list", overlay);
  const closeBtn = qs(".experience-popup-close", overlay);

  let closeTimer = null;
  let pinned = false;

  const clearCloseTimer = () => {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
  };

  const closePopup = () => {
    overlay.classList.remove("open");
    pinned = false;
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer = setTimeout(() => {
      if (!pinned) closePopup();
    }, 120);
  };

  const openPopup = (exp) => {
    if (!exp) return;
    titleEl.textContent = safeText(exp.title, "Experience");
    metaEl.textContent = `${safeText(exp.company)} | ${safeText(exp.period)}`;

    const points = Array.isArray(exp.responsibilities) && exp.responsibilities.length
      ? exp.responsibilities
      : [safeText(exp.description)].filter(Boolean);

    listEl.innerHTML = points.map((point) => `<li>${esc(point)}</li>`).join("");
    overlay.classList.add("open");
  };

  timelineItems.forEach((itemEl) => {
    const index = Number(itemEl.dataset.expIndex);
    const exp = items[index];

    itemEl.addEventListener("mouseenter", () => {
      if (pinned) return;
      clearCloseTimer();
      openPopup(exp);
    });

    itemEl.addEventListener("mouseleave", () => {
      if (!pinned) scheduleClose();
    });

    itemEl.addEventListener("click", () => {
      pinned = true;
      clearCloseTimer();
      openPopup(exp);
    });
  });

  popup.addEventListener("mouseenter", clearCloseTimer);
  popup.addEventListener("mouseleave", () => {
    if (!pinned) scheduleClose();
  });

  closeBtn.addEventListener("click", closePopup);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closePopup();
  });
}

function renderCertifications(certifications = {}) {
  const grid = qs("#certificationsGrid");
  if (!grid) return;

  const acquired = Array.isArray(certifications.acquired) ? certifications.acquired : [];
  const planned = Array.isArray(certifications.planned) ? certifications.planned : [];

  const pills = [];

  acquired.forEach((cert) => {
    pills.push(`<span class="cert-pill-item acquired"><i class="fas fa-check-circle"></i>${esc(cert)}</span>`);
  });

  planned.forEach((cert) => {
    pills.push(`<span class="cert-pill-item planned"><i class="fas fa-clock"></i>${esc(cert)}</span>`);
  });

  grid.innerHTML = pills.length
    ? pills.join("")
    : '<p class="section-empty">No certifications added yet.</p>';
}

const SKILL_FALLBACK_MAP = {
  "AWS Cloud Services": {
    iconClass: "aws",
    tags: ["AWS EC2", "VPC", "IAM", "S3", "EKS", "ALB"]
  },
  "Infrastructure as Code": {
    iconClass: "iac",
    tags: ["Terraform", "Ansible"]
  },
  "CI/CD & Version Control": {
    iconClass: "cicd",
    tags: ["Jenkins", "GitHub Actions", "Git"]
  },
  "Containers & Orchestration": {
    iconClass: "k8s",
    tags: ["Docker", "Kubernetes"]
  },
  "Monitoring & Logging": {
    iconClass: "monitor",
    tags: ["Grafana", "Checkmk", "CloudWatch"]
  },
  "OS & Scripting": {
    iconClass: "os",
    tags: ["Linux (RHEL)", "Bash", "Python", "boto3"]
  }
};

const SKILL_ICON_MAP = {
  aws: "fa-cloud",
  iac: "fa-cubes",
  cicd: "fa-code-branch",
  k8s: "fa-dharmachakra",
  monitor: "fa-chart-line",
  os: "fa-terminal"
};

function buildSkillCard(skill) {
  const fallback = SKILL_FALLBACK_MAP[skill.name] || {};
  const iconClass = safeText(skill.iconClass || fallback.iconClass || "os");
  const icon = SKILL_ICON_MAP[iconClass] || "fa-terminal";
  let tags = Array.isArray(skill.tags) && skill.tags.length ? skill.tags : [];

  if (!tags.length && Array.isArray(fallback.tags) && fallback.tags.length) {
    tags = fallback.tags;
  }

  if (!tags.length) {
    const fromModel = [skill.category, skill.level].filter(Boolean).map((v) => safeText(v));
    tags = fromModel.length ? fromModel : ["DevOps"];
  }

  return `
    <article class="skill-card">
      <div class="skill-header">
        <h3>${esc(skill.name || "Skill")}</h3>
        <span class="skill-icon ${esc(iconClass)}"><i class="fas ${esc(icon)}"></i></span>
      </div>
      <div class="skill-tags">
        ${tags.map((tag) => `<span>${esc(tag)}</span>`).join("")}
      </div>
    </article>
  `;
}

function renderSkills(skills = [], selector = ".skills-grid") {
  const grid = qs(selector);
  if (!grid) return;

  if (!Array.isArray(skills) || skills.length === 0) {
    grid.innerHTML = '<p class="section-empty">No skills available.</p>';
    return;
  }

  grid.innerHTML = skills.map(buildSkillCard).join("");
}

function buildProjectCard(project) {
  const id = getProjectId(project);
  const likeId = getProjectLikeId(project);
  const tags = getProjectTags(project);
  const likedKey = `project_like_${likeId}`;
  const liked = Boolean(localStorage.getItem(likedKey));
  const likes = Number(project.likes || 0);

  return `
    <article class="project-card ${project.featured ? "featured" : ""}" data-project-id="${esc(id)}">
      ${project.featured ? '<span class="featured-badge">Featured</span>' : ""}
      <div class="project-header">
        <h3>${esc(project.title || "Project")}</h3>
        <a href="${esc(getProjectGithub(project))}" target="_blank" rel="noopener noreferrer" aria-label="Project source">
          <i class="fab fa-github"></i>
        </a>
      </div>
      <p>${esc(project.description || "")}</p>
      <div class="tags-likes">
        <div class="tags">
          ${tags.map((tag) => `<span class="tag">${esc(tag)}</span>`).join("")}
        </div>
        <button class="project-like ${liked ? "liked" : ""}" data-like-id="${esc(likeId || "")}" type="button">
          <i class="${liked ? "fa-solid" : "fa-regular"} fa-heart"></i>
          <span class="like-count">${likes}</span>
        </button>
      </div>
      <div class="project-actions">
        <a href="project-details.html?id=${encodeURIComponent(id)}" class="details-link">View Details</a>
      </div>
    </article>
  `;
}

function bindProjectLikes(container) {
  if (!container) return;

  qsa(".project-like", container).forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.likeId;
      if (!id) return;

      const key = `project_like_${id}`;
      if (localStorage.getItem(key)) return;

      try {
        const data = await fetchJSON(`/projects/${encodeURIComponent(id)}/like`, { method: "POST" });
        if (data.success) {
          localStorage.setItem(key, "1");
          btn.classList.add("liked");
          const icon = qs("i", btn);
          if (icon) {
            icon.classList.remove("fa-regular");
            icon.classList.add("fa-solid");
          }
          const countEl = qs(".like-count", btn);
          if (countEl) countEl.textContent = safeText(data.likes, "0");
        }
      } catch (err) {
        console.error("Project like error:", err);
      }
    });
  });
}

async function loadHomeProjects() {
  const grid = qs("#projectGrid");
  if (!grid) return;

  try {
    const projects = await fetchJSON("/projects");
    const featured = projects.filter((p) => p.featured === true);

    if (!featured.length) {
      grid.innerHTML = '<p class="section-empty">No featured projects available yet.</p>';
      return;
    }

    grid.innerHTML = featured.map(buildProjectCard).join("");
    bindProjectLikes(grid);
  } catch (err) {
    console.error("Home projects load error:", err);
    grid.innerHTML = '<p class="section-empty">Unable to load projects right now.</p>';
  }
}

async function loadProjectsPage() {
  const projectsSection = qs(".projects-page");
  const projectGrid = qs(".projects-page .project-grid");
  if (!projectsSection || !projectGrid) return;

  try {
    const projects = await fetchJSON("/projects");
    const filterButtons = qsa(".filter-btn");

    const renderList = (items) => {
      projectGrid.innerHTML = items.map(buildProjectCard).join("");
      bindProjectLikes(projectGrid);
    };

    renderList(projects);

    if (filterButtons.length) {
      filterButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
          filterButtons.forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");

          const filter = safeText(btn.textContent).trim();
          if (filter.toLowerCase() === "all") {
            renderList(projects);
            return;
          }

          const filtered = projects.filter((project) => getProjectTags(project).includes(filter));
          renderList(filtered);
        });
      });
    }
  } catch (err) {
    console.error("Projects page load error:", err);
    projectGrid.innerHTML = '<p class="section-empty">Unable to load projects right now.</p>';
  }
}

function buildEndorsementCard(item) {
  const id = item.id || item._id;
  const key = `endorsement_like_${id}`;
  const liked = Boolean(localStorage.getItem(key));
  const likes = Number(item.likes || 0);

  return `
    <article class="endorsement-card" data-endorsement-id="${esc(id || "")}">
      <p class="endorsement-text">"${esc(item.message || "")}"</p>
      <div class="endorsement-footer">
        <div>
          <strong>${esc(item.name || "Anonymous")}</strong>
          <span>${esc(item.role || "")}</span>
        </div>
        <div class="endorsement-stats">
          <span>${esc(formatDate(item.date))}</span>
          ${id ? `
            <button type="button" class="endorse-like ${liked ? "liked" : ""}" data-id="${esc(id)}">
              ${liked ? "❤" : "🤍"} ${likes}
            </button>
          ` : ""}
        </div>
      </div>
    </article>
  `;
}

function bindEndorsementLikes(container) {
  if (!container) return;

  qsa(".endorse-like", container).forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      if (!id) return;

      const key = `endorsement_like_${id}`;
      if (localStorage.getItem(key)) return;

      try {
        const data = await fetchJSON(`/endorsements/${encodeURIComponent(id)}/like`, { method: "POST" });
        if (data.success) {
          localStorage.setItem(key, "1");
          btn.classList.add("liked");
          btn.textContent = `❤ ${safeText(data.likes, "0")}`;
        }
      } catch (err) {
        console.error("Endorsement like error:", err);
      }
    });
  });
}

async function loadHomeEndorsements() {
  const grid = qs("#endorsementGrid");
  if (!grid) return;

  try {
    const endorsements = await fetchJSON("/endorsements");
    const latestTwo = endorsements.slice(0, 2);
    if (!latestTwo.length) {
      grid.innerHTML = '<p class="section-empty">No endorsements yet.</p>';
      return;
    }

    grid.innerHTML = latestTwo.map(buildEndorsementCard).join("");
    bindEndorsementLikes(grid);
  } catch (err) {
    console.error("Home endorsements load error:", err);
    grid.innerHTML = '<p class="section-empty">Unable to load endorsements right now.</p>';
  }
}

async function loadEndorsementsPage() {
  const form = qs("#endorsementForm");
  const list = qs("#endorsementList");
  if (!form && !list) return;

  async function refresh() {
    if (!list) return;
    try {
      const endorsements = await fetchJSON("/endorsements");
      list.innerHTML = endorsements.map(buildEndorsementCard).join("");
      bindEndorsementLikes(list);
    } catch (err) {
      console.error("Endorsements list load error:", err);
      list.innerHTML = '<p class="section-empty">Unable to load endorsements.</p>';
    }
  }

  await refresh();

  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const payload = {
        name: form.name.value.trim(),
        role: form.role.value.trim(),
        message: form.message.value.trim()
      };

      if (!payload.name || !payload.message) {
        showToast("Name and message are required.", "error");
        return;
      }

      try {
        const data = await fetchJSON("/endorsements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (data.success) {
          form.reset();
          await refresh();
          showToast("Endorsement submitted successfully.", "success");
        }
      } catch (err) {
        console.error("Endorsement submit error:", err);
        showToast("Unable to submit endorsement right now.", "error");
      }
    });
  }
}

async function loadAboutData() {
  const needsHomeAbout = qs("#experienceTimeline") || qs("#certificationsGrid") || qs("#heroName");
  if (!needsHomeAbout) return;

  try {
    const about = await fetchJSON("/about");

    if (qs("#heroName") && about.intro) {
      const heroName = qs("#heroName");
      const heroImage = qs("#heroImage");
      const heroDescription = qs("#heroDescription");
      const heroDescriptionExtra = qs("#heroDescriptionExtra");
      const heroRole = qs("#heroRole");

      if (heroName) heroName.textContent = safeText(about.intro.name, "Kota Durga");
      if (heroImage && about.intro.image) heroImage.src = about.intro.image;
      if (heroDescription && Array.isArray(about.intro.paragraphs) && about.intro.paragraphs.length) {
        heroDescription.textContent = about.intro.paragraphs[0];
      }
      if (heroDescriptionExtra && Array.isArray(about.intro.paragraphs) && about.intro.paragraphs[1]) {
        heroDescriptionExtra.textContent = about.intro.paragraphs[1];
      }

      if (heroRole && Array.isArray(about.experience) && about.experience.length && about.experience[0].title) {
        heroRole.textContent = about.experience[0].title;
      }
    }

    renderExperience(about.experience || []);
    renderCertifications(about.certifications || {});

  } catch (err) {
    console.error("About data load error:", err);
  }
}

async function loadSkillsData() {
  const skillsGridOnHome = qs("#skillsGrid");
  if (!skillsGridOnHome) return;

  try {
    const skills = await fetchJSON("/skills");
    renderSkills(skills, "#skillsGrid");
  } catch (err) {
    console.error("Skills load error:", err);
  }
}

function setupFeedbackVisibility() {
  const section = qs("#feedback");
  if (!section) return;

  const isDirectFeedbackLink = window.location.hash === "#feedback";
  if (!isDirectFeedbackLink) {
    section.classList.add("feedback-hidden");
  } else {
    section.classList.remove("feedback-hidden");
  }
}

function setupFeedbackSection() {
  const ratingCards = qsa(".rating-card");
  const feedbackInput = qs(".feedback-input");
  const submitBtn = qs(".feedback-submit");
  if (!ratingCards.length || !feedbackInput || !submitBtn) return;

  let selected = safeText(qs(".rating-card.active span")?.textContent).trim();

  ratingCards.forEach((card) => {
    card.addEventListener("click", () => {
      ratingCards.forEach((c) => c.classList.remove("active"));
      card.classList.add("active");
      selected = safeText(qs("span", card)?.textContent).trim();
    });
  });

  if (localStorage.getItem("feedbackSubmitted")) {
    submitBtn.disabled = true;
    submitBtn.classList.add("success");
    submitBtn.textContent = "Submitted";
  }

  submitBtn.addEventListener("click", async () => {
    if (!selected) {
      showToast("Please choose a rating.", "error");
      return;
    }

    if (localStorage.getItem("feedbackSubmitted")) return;

    try {
      const data = await fetchJSON("/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating: selected,
          comment: feedbackInput.value.trim()
        })
      });

      if (data.success) {
        localStorage.setItem("feedbackSubmitted", "1");
        submitBtn.disabled = true;
        submitBtn.classList.add("success");
        submitBtn.textContent = "Submitted";
        showToast("Thanks for your feedback.", "success");
      }
    } catch (err) {
      console.error("Feedback submit error:", err);
      showToast("Unable to submit feedback right now.", "error");
    }
  });
}

function setupContactForm() {
  const form = qs(".contact-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const inputs = qsa("input, textarea", form);
    const name = safeText(inputs[0]?.value).trim();
    const email = safeText(inputs[1]?.value).trim();
    const message = safeText(inputs[2]?.value).trim();

    if (!name || !email || !message) {
      alert("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      const data = await fetchJSON("/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message })
      });

      if (data.success) {
        const feedback = qs(".form-feedback", form);
        if (feedback) {
          feedback.textContent = "Thanks for reaching out!";
          feedback.style.color = "#22c55e";
        }
        inputs.forEach((i) => {
          i.value = "";
        });
      }
    } catch (err) {
      console.error("Contact submit error:", err);
      alert("Unable to send message right now.");
    }
  });
}

async function loadProjectDetailsPage() {
  const detailsRoot = qs(".project-details-header");
  if (!detailsRoot) return;

  const params = new URLSearchParams(window.location.search);
  const projectId = params.get("id");
  if (!projectId) return;

  try {
    const project = await fetchJSON(`/project-details/${encodeURIComponent(projectId)}`);

    const setText = (id, value) => {
      const el = qs(`#${id}`);
      if (el) el.textContent = safeText(value);
    };

    const setHref = (id, value) => {
      const el = qs(`#${id}`);
      if (el && value) el.href = value;
    };

    setText("title", project.title);
    setText("tagline", project.tagline);
    setText("problem", project.problem);
    setText("solution", project.solution);
    setText("impact", project.impact);
    setText("scale", project.scale || project.impact);
    setText("challenges", project.challenges);
    setText("learning", project.learning);
    setText("date", project.date);
    setText("category", project.category);
    setText("status", project.status);
    setHref("repo", project.repo);
    setHref("demo", project.demo || project.liveDemo);

    const tagsContainer = qs("#tags");
    if (tagsContainer) {
      tagsContainer.innerHTML = (project.tags || [])
        .map((tag) => `<span class="meta-tag">#${esc(tag)}</span>`)
        .join("");
    }

    const toolsContainer = qs("#tools");
    if (toolsContainer) {
      toolsContainer.innerHTML = (project.tools || [])
        .map((tool) => `<span class="tech-tag">${esc(tool)}</span>`)
        .join("");
    }

    const metrics = qs("#metrics");
    if (metrics) {
      metrics.innerHTML = (project.metrics || []).map((m) => `<li>${esc(m)}</li>`).join("");
    }
  } catch (err) {
    console.error("Project details load error:", err);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  applyMobileNav();
  applyBackToTop();
  applyFloatingButtons();

  setupFeedbackVisibility();
  setupFeedbackSection();
  setupContactForm();

  await Promise.all([
    loadStats(),
    loadAboutData(),
    loadSkillsData(),
    loadHomeProjects(),
    loadProjectsPage(),
    loadHomeEndorsements(),
    loadEndorsementsPage(),
    loadProjectDetailsPage()
  ]);
});

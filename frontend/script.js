/*************************
 * MOBILE NAV
 *************************/
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("nav-links");

if (hamburger && navLinks) {
  const overlay = document.createElement("div");
  overlay.classList.add("overlay");
  document.body.appendChild(overlay);

  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("open");
    overlay.classList.toggle("show");
  });

  overlay.addEventListener("click", () => {
    navLinks.classList.remove("open");
    overlay.classList.remove("show");
  });
}

/*************************
 * PAGE LOAD LOGIC
 *************************/
document.addEventListener("DOMContentLoaded", () => {

  /***********************
   * 1. VISITOR COUNT
   ***********************/
const visitedKey = "portfolio_visited";

if (!localStorage.getItem(visitedKey)) {
  // increment once
  fetch("https://portfolio-backend-bf4r.onrender.com/api/stats/visit", { method: "POST" })
    .then(res => res.json())
    .then(data => {
      const el = document.getElementById("visitorCount");
      if (el) el.innerText = data.visitors + "+";
      localStorage.setItem(visitedKey, "true");
    });
} else {
  // just read current count
  fetch("https://portfolio-backend-bf4r.onrender.com/api/stats")
    .then(res => res.json())
    .then(data => {
      const el = document.getElementById("visitorCount");
      if (el) el.innerText = data.visitors + "+";
    });
}

});

/*************************************************************************************************/
/* dynamically building website */
/* Endorsement */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("endorsementForm");
  const list = document.getElementById("endorsementList");
  const previewGrid = document.querySelector(".endorsement-grid"); // home page preview

  // helper: build endorsement card
  function renderEndorsementCard(e) {
    const card = document.createElement("div");
    card.className = "endorsement-card";
    card.innerHTML = `
      <p class="endorsement-text">"${e.message}"</p>
      <div class="endorsement-footer">
        <div>
          <strong>${e.name}</strong>
          <span>${e.role || ""}</span>
        </div>
        <div class="endorsement-stats">
          🗓 ${new Date(e.date).toLocaleDateString()}
          <button class="endorse-like ${localStorage.getItem("liked_" + e.id) ? "liked" : ""}" data-id="${e.id}">
            ${localStorage.getItem("liked_" + e.id) ? "❤️" : "🤍"} ${e.likes || 0}
          </button>
        </div>
      </div>
    `;
     // attach like handler
    const btn = card.querySelector(".endorse-like");
    btn.addEventListener("click", () => {
      const id = e.id;
      const key = "liked_" + id;

      if (localStorage.getItem(key)) return; // already liked

      fetch(`https://portfolio-backend-bf4r.onrender.com/api/endorsements/${id}/like`, { method: "POST" })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            localStorage.setItem(key, "true");
            btn.classList.add("liked");
            btn.innerHTML = `❤️ ${data.likes}`;
            btn.classList.add("pulse");
            setTimeout(() => btn.classList.remove("pulse"), 300);
          }
        })
        .catch(err => console.error("Like endorsement error:", err));
    });

    return card;
  }
  // Load endorsements on page load
  fetch("https://portfolio-backend-bf4r.onrender.com/api/endorsements")
    .then(res => res.json())
    .then(endorsements => {
      endorsements.sort((a, b) => new Date(b.date) - new Date(a.date));

      // endorsements page
      if (list) {
        list.innerHTML = "";
        const totalLikes = endorsements.reduce((sum, e) => sum + (e.likes || 0), 0);
        const totalLikesEl = document.getElementById("endorsementTotalLikes");
        if (totalLikesEl) totalLikesEl.innerText = `❤️ ${totalLikes}`;
        endorsements.forEach(e => list.appendChild(renderEndorsementCard(e)));
      }

      // home page preview (latest 2)
      if (previewGrid && !list) {
        previewGrid.innerHTML = "";
        endorsements.slice(0, 2).forEach(e => previewGrid.appendChild(renderEndorsementCard(e)));
      }
    })
    .catch(err => console.error("Load endorsements error:", err));
    // Handle form submission
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();

      const formData = {
        name: form.name.value,
        role: form.role.value,
        message: form.message.value
      };

      fetch("https://portfolio-backend-bf4r.onrender.com/api/endorsements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            alert("Endorsement submitted successfully!");
            form.reset();

            if (list) {
              const e = data.endorsement;
              list.prepend(renderEndorsementCard(e));
            }
          } else {
               alert("Error: " + (data.error || "Unable to submit"));
          }
        })
        .catch(err => console.error("Submit endorsement error:", err));
    });
  }
});

/*************************
 * PROJECTS
 *************************/
document.addEventListener("DOMContentLoaded", () => {
  const projectGrid = document.querySelector(".project-grid"); // projects.html
  const previewGrid = document.querySelector(".project-preview-grid"); // index.html
  const projectCount = document.getElementById("projectCount");

  const filterButtons = document.querySelectorAll(".filter-btn");

  // helper: build project card
  function renderProjectCard(p) {
    const card = document.createElement("div");
    card.className = "project-card" + (p.featured ? " featured" : "");

    card.innerHTML = `
      ${p.featured ? '<span class="featured-badge">Featured</span>' : ""}
      <div class="project-header">
        <h3>${p.title}</h3>
        <a href="${p.github}" target="_blank">
          <i class="fab fa-github"></i>
        </a>
      </div>
      <p>${p.description}</p>
      <div class="tags-likes">
        <div class="tags">
          ${p.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}
        </div>
        <div class="project-like ${localStorage.getItem("liked_" + p.id) ? "liked" : ""}" data-id="${p.id}">
          <i class="${localStorage.getItem("liked_" + p.id) ? "fa-solid" : "fa-regular"} fa-heart"></i>
          <span class="like-count">${p.likes || 0}</span>
        </div>
      </div>
    `;

    // like button handler
    const btn = card.querySelector(".project-like");
    btn.addEventListener("click", () => {
      const key = "liked_" + p.id;
      if (localStorage.getItem(key)) return; // already liked

      fetch(`https://portfolio-backend-bf4r.onrender.com/api/projects/${p.id}/like`, { method: "POST" })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            localStorage.setItem(key, "true");
            btn.classList.add("liked");
            btn.querySelector("i").classList.replace("fa-regular", "fa-solid");
            btn.querySelector(".like-count").innerText = data.likes;
          }
        })
        .catch(err => console.error("Project like error:", err));
    });

    return card;
  }

  // load all projects
  function loadProjects() {
    fetch("https://portfolio-backend-bf4r.onrender.com/api/projects")
      .then(res => res.json())
      .then(projects => {
        if (projectCount) projectCount.innerText = projects.length;
        // projects page
        if (projectGrid) {
          projectGrid.innerHTML = "";
          projects.forEach(p => projectGrid.appendChild(renderProjectCard(p)));
        }

        // home page featured
        if (previewGrid) {
          previewGrid.innerHTML = "";
          projects.filter(p => p.featured).forEach(p => previewGrid.appendChild(renderProjectCard(p)));
        }

        // filter buttons
        if (filterButtons.length > 0 && projectGrid) {
          filterButtons.forEach(btn => {
            btn.addEventListener("click", () => {
              const tag = btn.innerText;
              filterButtons.forEach(b => b.classList.remove("active"));
              btn.classList.add("active");

              projectGrid.innerHTML = "";
              const filtered = tag === "All" ? projects : projects.filter(p => p.tags.includes(tag));
              filtered.forEach(p => projectGrid.appendChild(renderProjectCard(p)));
            });
          });
        }
      })
      .catch(err => console.error("Load projects error:", err));
  }

  loadProjects();
});

/*************************
 * SKILLS
 *************************/
document.addEventListener("DOMContentLoaded", () => {
  const skillsGrid = document.querySelector(".skills-grid");

  // helper: build skill card
  function renderSkillCard(s) {
    const card = document.createElement("div");
    card.className = "skill-card";

    card.innerHTML = `
      <div class="skill-header">
        <div class="skill-icon ${s.iconClass}">☁️</div>
        <h3>${s.name}</h3>
      </div>
      <div class="skill-tags">
        ${s.tags.map(tag => `<span>${tag}</span>`).join("")}
      </div>
    `;

    return card;
  }

  // load skills
  function loadSkills() {
    fetch("https://portfolio-backend-bf4r.onrender.com/api/skills")
      .then(res => res.json())
      .then(skills => {
        if (skillsGrid) {
          skillsGrid.innerHTML = "";
          skills.forEach(s => skillsGrid.appendChild(renderSkillCard(s)));
        }
      })
      .catch(err => console.error("Load skills error:", err));
  }

  loadSkills();
});

document.addEventListener("DOMContentLoaded", () => {
  const homeSkillTags = document.querySelector(".home-skills .skill-tags");

  if (!homeSkillTags) return;

  fetch("https://portfolio-backend-bf4r.onrender.com/api/skills")
    .then(res => res.json())
    .then(skills => {
      homeSkillTags.innerHTML = "";

      // Flatten tags from all skills
      const allTags = skills.flatMap(s => s.tags);

      // Deduplicate and limit to top 10
      const uniqueTags = [...new Set(allTags)].slice(0, 10);

      uniqueTags.forEach(tag => {
        const pill = document.createElement("span");
        pill.className = "skill-tag";
        pill.innerText = tag;
        homeSkillTags.appendChild(pill);
      });
    })
    .catch(err => console.error("Home skills error:", err));
});

/*********** skill ends *******************/

/*************************
 * CONTACT FORM
 *************************/
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".contact-form");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const inputs = form.querySelectorAll("input, textarea");
    const name = inputs[0].value.trim();
    const email = inputs[1].value.trim();
    const message = inputs[2].value.trim();

    // validation
    if (!name || !email || !message) {
      alert("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email.");
      return;
    }

    try {
      const res = await fetch("https://portfolio-backend-bf4r.onrender.com/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message })
      });

      const result = await res.json();

      if (result.success) {
        const feedback = form.querySelector(".form-feedback");
        feedback.textContent = "Thanks for reaching out!";
        feedback.style.color = "limegreen";
        inputs.forEach(i => i.value = "");
      } else {
        alert(result.error || "Something went wrong.");
      }
    } catch (err) {
      console.error("Contact form error:", err);
      alert("Server error. Please try again later.");
    }
  });
});

/*voting section*/
/**************/
document.addEventListener("DOMContentLoaded", () => {
  const voteList = document.querySelector(".vote-list");
  if (!voteList) return;

  // Function to render skills
  function renderSkills(skills) {
    voteList.innerHTML = "";
    const totalVotes = skills.reduce((sum, s) => sum + s.votes, 0);

    skills.forEach(s => {
      const percent = totalVotes > 0 ? Math.round((s.votes / totalVotes) * 100) : 0;

      const item = document.createElement("div");
      item.className = "vote-item";
      item.dataset.percent = percent;

      item.innerHTML = `
        <span class="skill-name">${s.name}</span>
        <span class="vote-count">${s.votes} votes (${percent}%)</span>
        <button class="btn outline small" data-id="${s.id}">✔ Vote</button>
      `;

      // Attach vote handler
      const btn = item.querySelector("button");
      btn.addEventListener("click", () => {
        fetch(`https://portfolio-backend-bf4r.onrender.com/api/voting/${s.id}`, {
          method: "POST"
        })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              // Re-fetch skills to update percentages + progress fill
              fetch("https://portfolio-backend-bf4r.onrender.com/api/voting")
                .then(res => res.json())
                .then(updatedSkills => renderSkills(updatedSkills));
            }
          })
          .catch(err => console.error("Vote error:", err));
      });

      voteList.appendChild(item);

      // Apply progress fill immediately
      item.style.setProperty("--percent", item.dataset.percent);
    });
  }

  // Initial load
  fetch("https://portfolio-backend-bf4r.onrender.com/api/voting")
    .then(res => res.json())
    .then(skills => renderSkills(skills))
    .catch(err => console.error("Voting section error:", err));
});

/*feedback Section */
/*******************/

document.addEventListener("DOMContentLoaded", () => {
  const ratingCards = document.querySelectorAll(".rating-card");
  const feedbackInput = document.querySelector(".feedback-input");
  const submitBtn = document.querySelector(".feedback-submit");

  let selectedRating = document.querySelector(".rating-card.active span")?.innerText || "";

  // Handle rating selection
  ratingCards.forEach(card => {
    card.addEventListener("click", () => {
      ratingCards.forEach(c => c.classList.remove("active"));
      card.classList.add("active");
      selectedRating = card.querySelector("span").innerText;
    });
  });

  // Handle feedback submission
  submitBtn.addEventListener("click", () => {
    // Check if feedback already submitted in this browser
    if (localStorage.getItem("feedbackSubmitted")) {
      alert("🟢 You already submitted feedback. Thank you!");
      return;
    }

    const comment = feedbackInput.value.trim();

    if (!selectedRating) {
      alert("Please select a rating before submitting.");
      return;
    }

    fetch("https://portfolio-backend-bf4r.onrender.com/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating: selectedRating, comment })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          localStorage.setItem("feedbackSubmitted", "true"); // mark as submitted
          submitBtn.disabled = true; // prevent multiple submissions
          submitBtn.classList.add("success"); // apply success style
          submitBtn.innerText = "✔ Submitted"; // change button text only
        } else {
          alert("❌ Something went wrong. Please try again.");
        }
      })
      .catch(err => {
        console.error("Feedback error:", err);
        alert("❌ Error submitting feedback.");
      });
  });
});

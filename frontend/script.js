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
  fetch("http://localhost:5000/api/stats/visit", {
    method: "POST"
  })
    .then(res => res.json())
    .then(data => {
      const visitorEl = document.getElementById("visitorCount");
      if (visitorEl) visitorEl.innerText = data.visitors + "+";
    })
    .catch(err => console.error("Visitor error:", err));

  /***********************
   * 2. FETCH ALL STATS
   ***********************/
  fetch("http://localhost:5000/api/stats")
    .then(res => res.json())
    .then(data => {

      /* HERO STATS */
      const projectCount = document.getElementById("projectCount");
      if (projectCount) projectCount.innerText = data.projects;

      const techCount = document.getElementById("techCount");
      if (techCount) techCount.innerText = data.technologies || 0;

      /* FEATURED PROJECT LIKES */
      document.querySelectorAll(".project-like").forEach(el => {
        const project = el.dataset.project;
        const countEl = el.querySelector(".like-count");
        const icon = el.querySelector("i");

        // set latest count from backend
        if (data.featuredProjectLikes && data.featuredProjectLikes[project] !== undefined) {
          countEl.innerText = data.featuredProjectLikes[project];
        }

        // restore liked state
        if (localStorage.getItem(`liked_${project}`)) {
          el.classList.add("liked");
          icon.classList.remove("fa-regular");
          icon.classList.add("fa-solid");
        }
      });

      /* ENDORSEMENTS */
      const endorseThumbs = document.getElementById("endorseThumbs");
      if (endorseThumbs) endorseThumbs.innerText = data.endorsements.thumbs;

      const endorseHearts = document.getElementById("endorseHearts");
      if (endorseHearts) endorseHearts.innerText = data.endorsements.hearts;

      const endorseStars = document.getElementById("endorseStars");
      if (endorseStars) endorseStars.innerText = data.endorsements.stars;

    })
    .catch(err => console.error("Stats error:", err));
});

/*************************
 * LIKE BUTTON LOGIC
 *************************/
function toggleLike(el) {
  const project = el.dataset.project;
  const icon = el.querySelector("i");
  const countEl = el.querySelector(".like-count");

  const key = `liked_${project}`;

  // block multiple likes
  if (localStorage.getItem(key)) return;

  // mark liked locally
  localStorage.setItem(key, "true");

  // UI update
  el.classList.add("liked");
  icon.classList.remove("fa-regular");
  icon.classList.add("fa-solid");
  countEl.innerText = parseInt(countEl.innerText) + 1;

  // update backend
  fetch("http://localhost:5000/api/stats/like", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ project })
  }).catch(err => console.error("Like error:", err));
}

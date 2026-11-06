// Wedding website interactions. Edit the wedding date and event details in index.html as needed.
(function () {
  const weddingDate = new Date("2026-11-25T11:00:00+05:30").getTime();
  const fields = ["days", "hours", "minutes", "seconds"];
  function updateCountdown() {
    const distance = weddingDate - Date.now();
    const values = distance <= 0 ? [0, 0, 0, 0] : [
      Math.floor(distance / (1000 * 60 * 60 * 24)),
      Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      Math.floor((distance % (1000 * 60)) / 1000)
    ];
    fields.forEach((id, i) => { const el = document.getElementById(id); if (el) el.textContent = String(values[i]).padStart(2, "0"); });
  }
  updateCountdown(); setInterval(updateCountdown, 1000);

  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  menuToggle.addEventListener("click", () => {
    const open = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    menuToggle.textContent = open ? "×" : "☰";
  });
  mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
    mainNav.classList.remove("open"); menuToggle.setAttribute("aria-expanded", "false"); menuToggle.textContent = "☰";
  }));

  const form = document.getElementById("rsvpForm");
  if (form) {
    form.addEventListener("submit", event => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const saved = JSON.parse(localStorage.getItem("weddingRSVPs") || "[]");
      saved.push({ ...data, submittedAt: new Date().toISOString() });
      localStorage.setItem("weddingRSVPs", JSON.stringify(saved));
      const formSuccess = document.getElementById("formSuccess");
      if (formSuccess) formSuccess.textContent = `Thank you, ${data.guestName}! Your RSVP has been saved on this device. This demo does not notify the couple.`;
      form.reset();
    });
  }

  const lightbox = document.getElementById("lightbox");
  const caption = document.getElementById("lightboxCaption");
  document.querySelectorAll(".gallery-item").forEach(item => item.addEventListener("click", () => {
    caption.textContent = item.dataset.caption || "A beautiful memory";
    lightbox.classList.add("open");
  }));
  function closeLightbox(){ lightbox.classList.remove("open"); }
  document.getElementById("closeLightbox").addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", event => { if (event.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", event => { if (event.key === "Escape") closeLightbox(); });

  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav a");
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`));
    }
  }), { rootMargin: "-35% 0px -55% 0px" });
  sections.forEach(section => observer.observe(section));
// Wedding background music controls
const weddingMusic = document.getElementById("weddingMusic");
const musicToggle = document.getElementById("musicToggle");

if (weddingMusic && musicToggle) {
    weddingMusic.volume = 0.35;

    musicToggle.addEventListener("click", async () => {
        if (weddingMusic.paused) {
            try {
                await weddingMusic.play();
                musicToggle.textContent = "♫ Pause Music";
                musicToggle.setAttribute("aria-label", "Pause background music");
            } catch (error) {
                musicToggle.textContent = "Tap to Play Music";
            }
        } else {
            weddingMusic.pause();
            musicToggle.textContent = "♫ Play Music";
            musicToggle.setAttribute("aria-label", "Play background music");
        }
    });

    weddingMusic.addEventListener("ended", () => {
        musicToggle.textContent = "♫ Play Music";
    });
}
})();
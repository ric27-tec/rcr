
const noise = document.querySelector(".noise");
const noNoiseZones = document.querySelectorAll(".no-noise-zone");

if (noise && noNoiseZones.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      const isAnyZoneVisible = entries.some((entry) => entry.isIntersecting);
      noise.classList.toggle("noise-hidden", isAnyZoneVisible);
    },
    {
      threshold: 0.15
    }
  );

  noNoiseZones.forEach((zone) => observer.observe(zone));
}

function renderNotes() {
  const grid = document.querySelector("#notes-grid");
  const nav = document.querySelector("#notes-nav-list");

  if (grid) {
    grid.innerHTML = notes.map((note) => `
      <a class="post-card reveal" href="${note.url}">
        <p class="date">${note.date}</p>
        <h3>${note.title}</h3>
        <p>${note.excerpt}</p>
      </a>
    `).join("");
  }

  if (nav) {
    nav.innerHTML = notes.map((note) => `
      <a href="${note.url}">
        <span class="notes-nav-date">${note.date}</span>
        <span class="notes-nav-title-link">${note.title}</span>
      </a>
    `).join("");
  }
}

function revealOnScroll() {
  const items = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12
  });

  items.forEach((item) => observer.observe(item));
}

function fadeIntroOnScroll() {
  const item = document.querySelector(".fade-scroll");

  if (!item) {
    return;
  }

  function update() {
    const rect = item.getBoundingClientRect();
    const viewport = window.innerHeight;
    const center = rect.top + rect.height / 2;
    const distance = Math.abs(center - viewport / 2);
    const maxDistance = viewport * 0.55;
    const opacity = Math.max(0, 1 - distance / maxDistance);
    const translate = 42 * (1 - opacity);

    item.style.opacity = opacity.toFixed(3);
    item.style.transform = `translateY(${translate}px)`;
  }

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

function updateYear() {
  const year = document.querySelector("#year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }
}

function drawWorldGrid() {
  const canvas = document.querySelector("#world-grid");

  if (!canvas) {
    return;
  }

  const ctx = canvas.getContext("2d");
  const pixelRatio = window.devicePixelRatio || 1;

  function resize() {
    const size = Math.min(window.innerWidth, window.innerHeight) * 0.72;
    canvas.width = size * pixelRatio;
    canvas.height = size * pixelRatio;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    draw(size);
  }

  function draw(size) {
    const centerX = size * 0.5;
    const centerY = size * 0.5;
    const radius = size * 0.42;

    ctx.clearRect(0, 0, size, size);
    ctx.strokeStyle = "rgba(242, 239, 233, 0.08)";
    ctx.lineWidth = 1;

    for (let i = 0; i < 9; i += 1) {
      const r = radius * (i + 1) / 9;
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    for (let i = 0; i < 18; i += 1) {
      const angle = (Math.PI * 2 * i) / 18;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  }

  resize();
  window.addEventListener("resize", resize);
}

function keepGridOffPhotographs() {
  const grid = document.querySelector("#world-grid");
  const photoSections = document.querySelectorAll(".hero, .image-break, .visual-card, .note-hero");

  if (!grid || photoSections.length === 0) {
    return;
  }

  function update() {
    const centerY = window.innerHeight / 2;
    const isOverPhoto = Array.from(photoSections).some((section) => {
      const rect = section.getBoundingClientRect();
      return rect.top < centerY && rect.bottom > centerY;
    });

    grid.classList.toggle("grid-hidden", isOverPhoto);
  }

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

function addHeroParallax() {
  const heroImage = document.querySelector(".hero-photo");
  const heroContent = document.querySelector(".hero-content");

  if (!heroImage || !heroContent) {
    return;
  }

  window.addEventListener("scroll", () => {
    const scroll = window.scrollY;
    heroImage.style.transform = `scale(1.02) translateY(${scroll * 0.06}px)`;
    heroContent.style.transform = `translateY(${scroll * -0.025}px)`;
  }, { passive: true });
}

function initLightbox() {
  const lightbox = document.querySelector("#lightbox");
  const lightboxImage = lightbox ? lightbox.querySelector("img") : null;
  const closeButton = lightbox ? lightbox.querySelector(".lightbox-close") : null;
  const triggers = document.querySelectorAll("[data-lightbox]");

  if (!lightbox || !lightboxImage || !closeButton) {
    return;
  }

  function close() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      lightboxImage.src = trigger.dataset.lightbox;
      lightbox.classList.add("open");
      lightbox.setAttribute("aria-hidden", "false");
    });
  });

  closeButton.addEventListener("click", close);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      close();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      close();
    }
  });
}

renderNotes();
updateYear();
drawWorldGrid();
keepGridOffPhotographs();
revealOnScroll();
fadeIntroOnScroll();
addHeroParallax();
initLightbox();

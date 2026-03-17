async function getSlides() {
  try {
    const res = await fetch("/api/slides", { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

function startSlideshow(slides) {
  const slideA = document.getElementById("slideA");
  const slideB = document.getElementById("slideB");
  if (!slideA || !slideB) return;
  if (slides.length < 2) return;

  let index = 0;
  let active = slideA;
  let next = slideB;
  let switching = false;

  const intervalMs = 2200;

  async function tick() {
    if (switching) return;
    switching = true;
    index = (index + 1) % slides.length;
    const nextSrc = slides[index];

    await preloadImage(nextSrc);
    next.src = nextSrc;

    next.classList.add("is-active");
    active.classList.remove("is-active");

    const tmp = active;
    active = next;
    next = tmp;
    switching = false;
  }

  setInterval(tick, intervalMs);
}

document.addEventListener("DOMContentLoaded", async () => {
  const slides = await getSlides();
  if (slides.length >= 1) {
    const slideA = document.getElementById("slideA");
    if (slideA) slideA.src = slides[0];
  }
  startSlideshow(slides);
});

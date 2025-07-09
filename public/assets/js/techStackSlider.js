// techStackSlider.js → v1.0 → Animate horizontal tech stack slider
import anime from "https://cdn.jsdelivr.net/npm/animejs@3.2.1/lib/anime.es.js";

export function initializeTechStackSlider() {
  const track = document.querySelector(".logo-track");

  if (track) {
    // Clone the logos for an infinite loop
    const clone = track.cloneNode(true);
    track.parentElement.appendChild(clone);

    anime({
      targets: ".logo-track",
      translateX: ["0%", "-50%"],
      easing: "linear",
      duration: 20000,
      loop: true,
    });
  }
}
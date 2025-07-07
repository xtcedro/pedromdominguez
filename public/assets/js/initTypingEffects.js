// initTypingEffects.js
import { typeLineByLine } from './typingengine.js';

document.addEventListener("DOMContentLoaded", async () => {
  // Example: type headline
  const headline = document.getElementById("hero-headline");
  if (headline) {
    const text = headline.textContent;
    headline.textContent = "";
    await typeLineByLine(text, headline, 50);
  }

  // Example: type subheading
  const subheading = document.querySelector(".hero-subheading");
  if (subheading) {
    const text = subheading.textContent;
    subheading.textContent = "";
    await typeLineByLine(text, subheading, 30);
  }

  // Example: type each impact box
  const impactBoxes = document.querySelectorAll(".impact-box");
  for (const box of impactBoxes) {
    const h2 = box.querySelector("h2");
    const p = box.querySelector("p");

    if (h2) {
      const text = h2.textContent;
      h2.textContent = "";
      await typeLineByLine(text, h2, 35);
    }

    if (p) {
      const text = p.textContent;
      p.textContent = "";
      await typeLineByLine(text, p, 20);
    }
  }

  // Example: mission statement
  const mission = document.querySelector(".mission-statement");
  if (mission) {
    const text = mission.textContent;
    mission.textContent = "";
    await typeLineByLine(text, mission, 25);
  }
});
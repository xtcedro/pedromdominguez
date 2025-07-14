import { typeLineByLine } from './typingengine.js';

// ✅ Export as a reusable async function
export async function initializeTypingEffects() {
  // Helper: clear text + hide initially
  function prepareTyping(el) {
    if (!el) return null;
    const text = el.innerHTML.trim();
    el.innerHTML = "";
    el.style.visibility = "visible";
    return text;
  }

  // ✅ Typing: Whole Hero Section
  const heroSection = document.querySelector(".hero");
  if (heroSection) {
    const text = prepareTyping(heroSection);
    if (text) await typeLineByLine(text, heroSection, 15);
  }

  // ✅ Typing: Each Impact Box
  const impactBoxes = document.querySelectorAll(".impact-box");
  for (const box of impactBoxes) {
    const h2 = box.querySelector("h2");
    const p = box.querySelector("p");

    if (h2) {
      const textH2 = prepareTyping(h2);
      if (textH2) await typeLineByLine(textH2, h2, 15);
    }

    if (p) {
      const textP = prepareTyping(p);
      if (textP) await typeLineByLine(textP, p, 15);
    }
  }

  // ✅ Typing: Mission Statement
  const mission = document.querySelector(".mission-statement");
  if (mission) {
    const text = prepareTyping(mission);
    if (text) await typeLineByLine(text, mission, 15);
  }
}
// ✅ initializeTypingEffects.js
import { typeLineByLine } from './typingengine.js';

export async function initializeTypingEffects() {
  function prepareTyping(el) {
    if (!el) return null;
    const text = el.innerHTML.trim();
    el.innerHTML = "";
    el.style.visibility = "visible";
    return text;
  }

  // ✅ Whole Hero Content block
  const heroContent = document.querySelector(".hero-content");
  if (heroContent) {
    const text = prepareTyping(heroContent);
    if (text) await typeLineByLine(text, heroContent, 15);
  }

  // ✅ Impact Boxes
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

  // ✅ Mission Statement
  const mission = document.querySelector(".mission-statement");
  if (mission) {
    const text = prepareTyping(mission);
    if (text) await typeLineByLine(text, mission, 15);
  }
}
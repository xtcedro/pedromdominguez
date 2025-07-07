import { typeLineByLine } from "./typingengine.js";

document.addEventListener("DOMContentLoaded", async () => {
  const typedElements = document.querySelectorAll("[data-typed]");
  for (const el of typedElements) {
    const text = el.innerHTML.trim();
    el.innerHTML = "";
    el.style.visibility = "visible";
    await typeLineByLine(text, el, 40);
  }
});
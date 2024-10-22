// ==UserScript==
// @name        NotPixel
// @namespace   Violentmonkey Scripts
// @grant       none
// @version     1.0
// @author      -
// @description 9/1/2024, 7:13:21 PM
// @match        *://*notpx.app/*
// @downloadURL  https://github.com/vsotreshko/bug-free-happiness/raw/main/notpixel.user.js
// @updateURL    https://github.com/vsotreshko/bug-free-happiness/raw/main/notpixel.user.js
// ==/UserScript==

/** Custom functions -------------------------------------------------------------- */
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const simulateClick = (button) => {
  // // Simulate a real mouse click on the launchBotButton
  // const rect = button.getBoundingClientRect();
  // const centerX = rect.left + rect.width / 2 + getRandomInt(-5, 5);
  // const centerY = rect.top + rect.height / 2 + getRandomInt(-5, 5);

  const events = [
    new PointerEvent("pointerdown", {
      bubbles: true,
      cancelable: true,
      isTrusted: true,
      pointerId: 1,
      width: 1,
      height: 1,
      pressure: 0.5,
      pointerType: "touch",
    }),
    new MouseEvent("mousedown", { bubbles: true, cancelable: true, isTrusted: true, screenX: 182, screenY: 877 }),
    new PointerEvent("pointerup", {
      bubbles: true,
      cancelable: true,
      isTrusted: true,
      pointerId: 1,
      width: 1,
      height: 1,
      pressure: 0,
      pointerType: "touch",
    }),
    new MouseEvent("mouseup", { bubbles: true, cancelable: true, isTrusted: true, screenX: 182, screenY: 877 }),
    new MouseEvent("clic", { bubbles: true, cancelable: true, isTrusted: true, screenX: 182, screenY: 877 }),

    new PointerEvent("click", {
      bubbles: true,
      cancelable: true,
      isTrusted: true,
      pointerId: 1,
      width: 1,
      height: 1,
      pressure: 0,
      pointerType: "touch",
    }),
    new PointerEvent("pointerout", {
      bubbles: true,
      cancelable: true,
      isTrusted: true,
      pointerId: 1,
      width: 1,
      height: 1,
      pressure: 0,
      pointerType: "touch",
    }),
    new PointerEvent("pointerleave", {
      bubbles: true,
      cancelable: true,
      isTrusted: true,
      pointerId: 1,
      width: 1,
      height: 1,
      pressure: 0,
      pointerType: "touch",
    }),
    new MouseEvent("mouseout", { bubbles: true, cancelable: true, isTrusted: true, screenX: 182, screenY: 877 }),
    new MouseEvent("mouseleave", { bubbles: true, cancelable: true, isTrusted: true, screenX: 182, screenY: 877 }),
  ];

  events.forEach((event, index) => {
    setTimeout(() => button.dispatchEvent(event), index * 100);
  });
};

const simulateClickX = (button) => {
  const events = [
    new PointerEvent("pointerdown", {
      bubbles: true,
      cancelable: true,
      isTrusted: true,
      pointerId: 1,
      width: 1,
      height: 1,
      pressure: 0.5,
      pointerType: "touch",
    }),
    new MouseEvent("mousedown", { bubbles: true, cancelable: true, isTrusted: true, offsetX: 182, offsetY: 877 }),
    new PointerEvent("pointerup", {
      bubbles: true,
      cancelable: true,
      isTrusted: true,
      pointerId: 1,
      width: 1,
      height: 1,
      pressure: 0,
      pointerType: "touch",
    }),
    new MouseEvent("mouseup", { bubbles: true, cancelable: true, isTrusted: true, offsetX: 315, offsetY: 483 }),
    new PointerEvent("click", { bubbles: true, cancelable: true, isTrusted: true, offsetX: 315, offsetY: 483 }),
  ];

  events.forEach((event, index) => {
    setTimeout(() => button.dispatchEvent(event), index * 100);
  });
};

const waitForElement = async (document, selector, timeout = 10000) => {
  console.warn(`Waiting for: ${selector}`);
  return new Promise((resolve, reject) => {
    if (document.querySelector(selector)) {
      console.warn(`waitForElement: found ${selector} immediately`);
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        console.warn(`waitForElement: found ${selector} after DOM changed`);
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Resolve promise after 10 seconds if element is not found
    setTimeout(() => {
      console.warn(`waitForElement: ${selector} not found after 10 seconds`);
      observer.disconnect();
      resolve(null);
    }, timeout);
  });
};

function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

/** ------------------------------------------------------------------------------- */

// Симуляция событий указателя
function simulatePointerEvents(element, startX, startY, endX, endY) {
  const events = [
    new PointerEvent("pointerdown", { clientX: startX, clientY: startY, bubbles: true }),
    new PointerEvent("pointermove", { clientX: startX, clientY: startY, bubbles: true }),
    new PointerEvent("pointermove", { clientX: endX, clientY: endY, bubbles: true }),
    new PointerEvent("pointerup", { clientX: endX, clientY: endY, bubbles: true }),
  ];

  events.forEach((event) => element.dispatchEvent(event));
}

const clickPaintButton = async (document) => {
  const paintButton = await waitForElement(document, "#root > div > div:nth-child(7) > div > button > span");
  simulateClickX(paintButton);
};

const findColors = async (document) => {
  // Click on the active color
  const activeColorSelector = "#root > div > div:nth-child(7) > div > div:nth-child(2) > div:nth-child(1)";
  const activeColor = await waitForElement(document, activeColorSelector);
  simulateClickX(activeColor);

  // Await palette to appear
  await delay(1000);

  // Get palette colors
  const paletteSelector = "#root > div > div:nth-child(7) > div > div:nth-child(3) > div > div:nth-child(2)";
  const palette = await waitForElement(document, paletteSelector);

  const colors = [];

  for (const child of palette.children) {
    if (child.style.backgroundColor === "rgb(109, 72, 47)") {
      colors.push(child);
    }

    if (child.style.backgroundColor === "rgb(0, 0, 0)") {
      colors.push(child);
    }
  }

  return colors;
};

const init = async () => {
  console.log("NotPixel Running...");

  // Wait for the blum template to appear
  await delay(3000);

  const blumTemplateSelector = "#root > div > div:nth-child(3) > div > div > button:nth-of-type(2)";
  const blumTemplate = await waitForElement(document, blumTemplateSelector);
  if (blumTemplate) {
    console.log("Found blum template");
    simulateClick(blumTemplate);
  }

  // Wait for animation to finish
  console.log("Waiting for canvas");
  await delay(5000);
  const canvas = await waitForElement(document, "#canvasHolder");
  simulatePointerEvents(canvas, canvas.width / 2, canvas.height / 2, canvas.width / 2, canvas.height / 2);
  simulateClickX(canvas);

  const canPaintCountSelector =
    "#root > div > div:nth-child(7) > div > button > div:nth-child(1) > div > div:nth-child(2) > span:nth-child(2)";
  const canPaintCountElement = await waitForElement(document, canPaintCountSelector);
  const canPaintCount = parseInt(canPaintCountElement.textContent);

  console.log(`Can paint ${canPaintCount} times`);
  if (canPaintCount > 0 && canPaintCount % 2 === 0) {
    const colors = await findColors(document);
    for (let i = 0; i < 2; i++) {
      for (const color of colors) {
        simulateClickX(color);
        await delay(500);
        await clickPaintButton(document);
        await delay(500);
      }
    }
  }
};

init();

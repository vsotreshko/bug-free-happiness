// ==UserScript==
// @name        Blum resolve fix
// @namespace   Violentmonkey Scripts
// @grant       none
// @version     3.1
// @author      -
// @description 9/1/2024, 7:13:21 PM
// @match        *://*notpx.app/*
// @downloadURL  https://github.com/vsotreshko/bug-free-happiness/raw/main/resolve.user.js
// @updateURL    https://github.com/vsotreshko/bug-free-happiness/raw/main/resolve.user.js
// ==/UserScript==

// !!! NOT PIXEL CODE !!!
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
      console.warn(`waitForElement: ${selector} not found after ${timeout} ms`);
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

const clickByCoof = async (canvas, x, y) => {
  simulatePointerEvents(canvas, canvas.width * x, canvas.height * y, canvas.width * x, canvas.height * y);
  simulateClickX(canvas);
};

const changeCursorPositionOnCanvas = async (canvas) => {
  const quarter = getRandomInt(20, 30) / 100; // (20 - 30)
  await clickByCoof(canvas, quarter, quarter);
};

const selectBlumTemplate = async (document) => {
  const blumTemplateSelector = "#root > div > div:nth-child(3) > div > div > button:nth-of-type(2)";
  const blumTemplate = await waitForElement(document, blumTemplateSelector);
  if (blumTemplate) {
    console.log("Found blum template");
    simulateClick(blumTemplate);
    return true;
  }

  return false;
};

const getCanPaintCount = async (document) => {
  const canPaintCountSelector =
    "#root > div > div:nth-child(7) > div > button > div:nth-child(1) > div > div:nth-child(2) > span:nth-child(2)";
  const canPaintCountElement = await waitForElement(document, canPaintCountSelector);
  return parseInt(canPaintCountElement.textContent);
};

const init = async () => {
  console.log("NotPixel Running...");

  // Wait for the page to load
  await delay(3000);

  let res = await selectBlumTemplate(document);
  if (!res) {
    console.log("!!! !!! Blum template not found !!! !!!");
    return;
  }

  await delay(2000);

  const templateCatalogTitleSelector = "#root > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > h1";
  const templateCatalogTitle = await waitForElement(document, templateCatalogTitleSelector, 2000);

  if (templateCatalogTitle.textContent.trim().toLowerCase().includes("templates")) {
    await delay(2000);

    const blumTemplateSelector =
      "#root > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > div > div:nth-child(1) > div:nth-child(2) > div > img";
    const blumTemplate = await waitForElement(document, blumTemplateSelector);
    simulateClick(blumTemplate);

    const buttonSelector = "body > div:nth-child(8) > div > div > div > div:nth-child(4) > button";
    const button = await waitForElement(document, buttonSelector);
    simulateClick(button);
  }

  const canvas = await waitForElement(document, "#canvasHolder");
  await changeCursorPositionOnCanvas(canvas);
  await delay(1000);

  const canPaintCount = await getCanPaintCount(document);

  if (canPaintCount > 1) {
    for (let i = 0; i < Math.floor(canPaintCount / 2); i++) {
      await delay(1000);
      await changeCursorPositionOnCanvas(canvas);
      const colors = await findColors(document);

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

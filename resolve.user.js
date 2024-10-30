// ==UserScript==
// @name        Blum resolve fix
// @namespace   Violentmonkey Scripts
// @grant       none
// @version     3.5
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

const simulateClickHaloween = (button) => {
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
    new MouseEvent("mousedown", { bubbles: true, cancelable: true, isTrusted: true, offsetX: 137, offsetY: 91 }),
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
    new MouseEvent("mouseup", { bubbles: true, cancelable: true, isTrusted: true, offsetX: 137, offsetY: 91 }),
    new PointerEvent("click", { bubbles: true, cancelable: true, isTrusted: true, offsetX: 137, offsetY: 91 }),
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
  const paintButton = await waitForElement(document, "#root > div > div._order_panel_lwgvy_1 > div > button > span");
  simulateClickX(paintButton);
};

const findColors = async (document) => {
  // Click on the active color
  const activeColorSelector =
    "#root > div > div._order_panel_lwgvy_1 > div > div._info_lwgvy_42 > div._active_color_lwgvy_51";
  const activeColor = await waitForElement(document, activeColorSelector);
  simulateClickX(activeColor);

  // Await palette to appear
  await delay(1000);

  // Get palette colors
  const paletteSelector =
    "#root > div > div._order_panel_lwgvy_1 > div > div._expandable_panel_layout_1v9vd_1 > div > div._color_line_epppt_15";
  const palette = await waitForElement(document, paletteSelector);

  const colors = [];

  for (const child of palette.children) {
    // if (child.style.backgroundColor === "rgb(109, 72, 47)") {
    //   colors.push(child);
    // }

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
  const quarter = getRandomInt(10, 15) / 100; // (20 - 30)
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
    "#root > div > div:nth-child(8) > div > button > div:nth-child(1) > div > div:nth-child(2) > span:nth-child(2)";
  const canPaintCountElement = await waitForElement(document, canPaintCountSelector);
  return parseInt(canPaintCountElement.textContent);
};

const autoClaimReward = async (document) => {
  const claimMenuButtonSelector = "#root > div > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(2) > button";
  const claimMenuButton = await waitForElement(document, claimMenuButtonSelector);
  simulateClick(claimMenuButton);

  await delay(1000);

  const claimButtonSelector =
    "#root > div > div._layout_4nkxd_1 > div._content_4nkxd_22 > div._container_13oyr_1 > button";
  const claimButton = await waitForElement(document, claimButtonSelector);
  simulateClick(claimButton);

  await delay(1000);

  const backButtonSelector = "#root > div > div:nth-child(2) > button";
  const backButton = await waitForElement(document, backButtonSelector);
  simulateClick(backButton);
};

const resolveHaloween = async (document, canvas) => {
  const haloweenSkillSelector = "#root > div > div._layout_1xfz6_1 > div > button:nth-child(3)";
  const haloweenSkill = await waitForElement(document, haloweenSkillSelector);
  simulateClick(haloweenSkill);

  await delay(1000);

  simulatePointerEvents(canvas, canvas.width * 0.1, canvas.height * 0.1, canvas.width * 0.1, canvas.height * 0.1);

  simulateClickHaloween(canvas);
  console.log("Clicked on haloween skill");
};

const resolveHaloweenModal = async (document) => {
  const letsGoSelector = "#root > div > div._layout_16huv_1 > div > div > div._footer_11ui8_136 > button";
  const letsGo = await waitForElement(document, letsGoSelector);

  if (letsGo) {
    simulateClick(letsGo);

    const claimSelector =
      "#root > div > div._layout_4nkxd_1 > div._content_4nkxd_22 > div._info_layout_bt2qf_1 > div > div:nth-child(3) > div";
    const claim = await waitForElement(document, claimSelector);
    simulateClick(claim);

    const backButtonSelector = "#root > div > div:nth-child(2) > button";
    const backButton = await waitForElement(document, backButtonSelector);
    simulateClick(backButton);
  }
};

const init = async () => {
  console.log("NotPixel Running...");

  // Wait for the page to load
  await delay(3000);

  await resolveHaloweenModal(document);

  let res = await selectBlumTemplate(document);
  if (!res) {
    console.log("!!! !!! Blum template not found !!! !!!");
    return;
  }

  await delay(2000);

  const templateCatalogTitleSelector = "#root > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(1) > h1";
  const templateCatalogTitle = await waitForElement(document, templateCatalogTitleSelector, 2000);

  if (templateCatalogTitle && templateCatalogTitle.textContent.trim().toLowerCase().includes("templates")) {
    await delay(2000);

    const blumTemplateSelector =
      "#root > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(3) > div > div:nth-child(1) > div:nth-child(2) > div > img";
    const blumTemplate = await waitForElement(document, blumTemplateSelector);
    simulateClick(blumTemplate);

    await delay(1000);

    const buttonSelector = "body > div:nth-child(8) > div > div > div > div:nth-child(4) > button";
    const button = await waitForElement(document, buttonSelector);
    simulateClick(button);

    await delay(2000);

    window.location.reload();
  }

  const canvas = await waitForElement(document, "#canvasHolder");
  await changeCursorPositionOnCanvas(canvas);
  await delay(1000);

  const canPaintCount = await getCanPaintCount(document);

  await resolveHaloween(document, canvas);
  await resolveHaloween(document, canvas);
  await resolveHaloween(document, canvas);
  await resolveHaloween(document, canvas);
  await resolveHaloween(document, canvas);
  await resolveHaloween(document, canvas);

  if (canPaintCount > 1) {
    for (let i = 0; i < canPaintCount; i++) {
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

  await autoClaimReward(document);
};

init();

// ==UserScript==
// @name        Blum resolve fix
// @namespace   Violentmonkey Scripts
// @grant       none
// @version     5.8
// @author      -
// @description 9/1/2024, 7:13:21 PM
// @match        *://*onetime.dog/*
// @downloadURL  https://github.com/vsotreshko/bug-free-happiness/raw/main/resolve.user.js
// @updateURL    https://github.com/vsotreshko/bug-free-happiness/raw/main/resolve.user.js
// ==/UserScript==

/** Custom functions -------------------------------------------------------------- */
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const simulateClickIfExist = async (name, selector) => {
  const claimButton = await waitForElement(document, selector);
  if (claimButton) {
    simulateClick(claimButton);
  } else {
    console.error(`${name} wasn't found`);
  }
};

const simulateClick = (button) => {
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

const init = async () => {
  const startJourneyBtnSelector = "#root > div > div:nth-child(4) > div:nth-child(2)";

  await simulateClickIfExist("Start Journey", startJourneyBtnSelector);

  await delay(getRandomInt(1000, 3000));

  const calendarSelector = "#root > div > div:nth-child(3) > div:nth-child(2) > div:nth-child(5) > div";
  const calendar = await waitForElement(document, calendarSelector);
  if (calendar) {
    const currentDay = Array.from(calendar.children).find((child) => {
      return child.className.includes("current");
    });

    if (currentDay) {
      console.log("Found current day:", currentDay);
      await delay(getRandomInt(1000, 3000));

      await simulateClick(currentDay);

      await delay(getRandomInt(1000, 3000));

      const closeButtonSelector = "#root > div > div:nth-child(4) > div > div:nth-child(2)";

      await simulateClickIfExist("Close button", closeButtonSelector);
    } else {
      console.warn("Could not find current day in calendar");
    }
  }
};

init();

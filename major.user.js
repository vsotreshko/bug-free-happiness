// ==UserScript==
// @name        Major
// @namespace   Violentmonkey Scripts
// @grant       none
// @version     1.0
// @author      -
// @description 9/1/2024, 7:13:21 PM
// @match       *://major.bot/*
// @downloadURL https://github.com/vsotreshko/bug-free-happiness/raw/main/major.user.js
// @updateURL   https://github.com/vsotreshko/bug-free-happiness/raw/main/major.user.js
// ==/UserScript==

/** Custom functions -------------------------------------------------------------- */
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const simulateClick = (button) => {
  // Simulate a real mouse click on the launchBotButton
  const rect = button.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2 + getRandomInt(-5, 5);
  const centerY = rect.top + rect.height / 2 + getRandomInt(-5, 5);

  //   button.dispatchEvent(
  //     new MouseEvent("mousedown", {
  //       bubbles: true,
  //       cancelable: true,
  //       view: window,
  //       clientX: centerX,
  //       clientY: centerY,
  //     })
  //   );

  //   button.dispatchEvent(
  //     new MouseEvent("mouseup", {
  //       bubbles: true,
  //       cancelable: true,
  //       view: window,
  //       clientX: centerX,
  //       clientY: centerY,
  //     })
  //   );

  button.dispatchEvent(
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: centerX,
      clientY: centerY,
    })
  );

  //   button.click();
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

/** ------------------------------------------------------------------------------- */

const init = async () => {
  window.onclick = (e) => {
    console.log(e.target); // to get the element
    console.log(e.target.tagName); // to get the element tag name alone
  };

  console.log("MAJOR Running...");

  const earnTab = await waitForElement(document, "#root > div > div > div > div > footer > a:nth-child(1)");
  if (earnTab) {
    simulateClick(earnTab);

    await delay(getRandomInt(1000, 3000));

    const tasks = document.querySelectorAll(".custom-container");
    if (tasks.length > 0) {
      for (const taskItem of tasks) {
        const titleSpan = taskItem.querySelector("span");
        const title = titleSpan.textContent.trim().toLowerCase();
        console.log(title);
      }
    }
  }
};

init();

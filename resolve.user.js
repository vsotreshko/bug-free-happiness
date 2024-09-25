// ==UserScript==
// @name        Blum resolve fix
// @namespace   Violentmonkey Scripts
// @grant       none
// @version     1.4
// @author      -
// @description 9/1/2024, 7:13:21 PM
// @match        https://telegram.blum.codes/*
// @downloadURL  https://github.com/vsotreshko/bug-free-happiness/raw/main/resolve.user.js
// @updateURL    https://github.com/vsotreshko/bug-free-happiness/raw/main/resolve.user.js
// ==/UserScript==

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const waitForElement = async (document, selector) => {
  console.warn(`Waiting for: ${selector}`);
  return new Promise((resolve) => {
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
    }, 10000);
  });
};

const init = async () => {
  const claimButton = await waitForElement(document, "button.kit-button.is-large.is-fill.button");
  if (claimButton) {
    await delay(1000);
    claimButton.click();
  }

  await delay(1000);

  const frensTab = await waitForElement(document, 'a[href*="/frens"]');
  if (frensTab) {
    await delay(1000);
    frensTab.click();
  }

  await delay(1000);

  const frensClaim = await waitForElement(document, "button.claim-button");
  if (frensClaim) {
    await delay(1000);
    frensClaim.click();
  }

  await delay(1000);

  const homeTab = await waitForElement(document, 'a[href*="/"]');
  if (homeTab) {
    await delay(1000);
    homeTab.click();
  }

  await delay(1000);

  const startFarming = await waitForElement(document, "button.kit-button.is-large.is-fill.button");
  if (startFarming) {
    await delay(1000);
    startFarming.click();
  }

  await delay(1000);

  const playGameButton = await waitForElement(document, "a.play-btn");
  if (playGameButton) {
    await delay(1000);
    playGameButton.click();
  }
};

init();

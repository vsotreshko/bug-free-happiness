// ==UserScript==
// @name        Blum resolve fix
// @namespace   Violentmonkey Scripts
// @grant       none
// @version     1.0
// @author      -
// @description 9/1/2024, 7:13:21 PM
// @match https://web.telegram.org/*
// @include https://telegram.blum.codes/*
// @downloadURL  https://github.com/vsotreshko/bug-free-happiness/raw/main/resolve.user.js
// @updateURL    https://github.com/vsotreshko/bug-free-happiness/raw/main/resolve.user.js
// ==/UserScript==

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const launchBlum = async (window) => {
  if (window.location.href.startsWith("https://web.telegram.org/")) {
    window.location.href = "https://web.telegram.org/k/#@BlumCryptoBot";

    await delay(5000);

    const launchBotButton = await waitForElement(document, "button.reply-markup-button");

    await delay(1000);

    launchBotButton.click();
  }
};

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
  });
};

window.addEventListener(
  "load",
  async function () {
    await launchBlum(window);

    await delay(5000);

    const playGameButton = await waitForElement(document, "a.play-btn");
    playGameButton.click();
  },
  false
);

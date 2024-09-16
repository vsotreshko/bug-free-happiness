// ==UserScript==
// @name        Start bot
// @namespace   Violentmonkey Scripts
// @grant       none
// @version     1.0
// @author      -
// @description 9/1/2024, 7:13:21 PM
// @match       https://web.telegram.org/*
// @downloadURL https://github.com/vsotreshko/bug-free-happiness/raw/main/start-bot.user.js
// @updateURL   https://github.com/vsotreshko/bug-free-happiness/raw/main/start-bot.user.js
// ==/UserScript==

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const launchBlum = async (window) => {
  if (window.location.href.startsWith("https://web.telegram.org/")) {
    window.location.href = "https://web.telegram.org/k/#@BlumCryptoBot";

    const launchBotButton = await Promise.race([
      waitForElement(document, "button.reply-markup-button"),
      waitForElement(document, "div.new-message-bot-commands.is-view"),
    ]);

    if (launchBotButton) {
      await delay(1000);
      launchBotButton.click();
    } else {
      window.location.reload();
    }
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

    // Resolve promise after 10 seconds if element is not found
    setTimeout(() => {
      console.warn(`waitForElement: ${selector} not found after 10 seconds`);
      observer.disconnect();
      resolve(null);
    }, 10000);
  });
};

window.addEventListener(
  "load",
  async function () {
    await launchBlum(window);
  },
  false
);

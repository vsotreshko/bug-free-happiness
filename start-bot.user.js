// ==UserScript==
// @name        Start bot
// @namespace   Violentmonkey Scripts
// @grant       none
// @version     1.3
// @author      -
// @description 9/1/2024, 7:13:21 PM
// @match       https://web.telegram.org/*
// @downloadURL https://github.com/vsotreshko/bug-free-happiness/raw/main/start-bot.user.js
// @updateURL   https://github.com/vsotreshko/bug-free-happiness/raw/main/start-bot.user.js
// ==/UserScript==

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const launchBlum = async (window) => {
  window.location.href = "https://web.telegram.org/k/#@BlumCryptoBot";
  await delay(5000);

  const launchBotButton = await Promise.any([
    waitForElement(document, "button.reply-markup-button"),
    waitForElement(document, "div.new-message-bot-commands.is-view"),
  ]);

  if (launchBotButton) {
    await delay(1000);
    launchBotButton.click();
  } else {
    window.location.reload();
  }
};

const launchNotPixel = async (window) => {
  window.location.href = "https://web.telegram.org/k/#@notpixel";
  await delay(5000);

  const launchBotButton = await Promise.any([
    waitForElement(document, "button.reply-markup-button"),
    waitForElement(document, "div.new-message-bot-commands.is-view"),
  ]);

  if (launchBotButton) {
    await delay(1000);
    launchBotButton.click();
  } else {
    window.location.reload();
  }
};

const waitForElement = async (document, selector) => {
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
      reject(null);
    }, 10000);
  });
};

async function clickBrowserHeaderButton(document) {
  const browserHeaderButton = await waitForElement(document, '[class*="_BrowserHeaderButton"]');
  if (browserHeaderButton) {
    browserHeaderButton.click();
  } else {
    console.warn("Browser header element not found");
  }
}

const init = async () => {
  await delay(5000); // Wait for window to load

  const hasNotPixel = await waitForElement(document, 'a[href="#7249432100"]');

  if (hasNotPixel) {
    await launchNotPixel(window);
    await delay(5 * 60 * 1000); // Wait 5 min to play
    await clickBrowserHeaderButton(document); // Close NotPixel
    await delay(5000); // Wait window to close
  }

  await launchBlum(window); // Start Blum
};

init();

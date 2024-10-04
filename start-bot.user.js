// ==UserScript==
// @name        Start bot
// @namespace   Violentmonkey Scripts
// @grant       none
// @version     3.1
// @author      -
// @description 9/1/2024, 7:13:21 PM
// @match       *://web.telegram.org/*
// @downloadURL https://github.com/vsotreshko/bug-free-happiness/raw/main/start-bot.user.js
// @updateURL   https://github.com/vsotreshko/bug-free-happiness/raw/main/start-bot.user.js
// ==/UserScript==

/** Custom functions -------------------------------------------------------------- */
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
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

const launchBlum = async (window, document) => {
  window.location.href = "https://web.telegram.org/k/#@BlumCryptoBot";

  const launchBotButton = await Promise.any([
    waitForElement(document, "button.reply-markup-button"),
    waitForElement(document, "div.new-message-bot-commands.is-view"),
  ]);

  if (launchBotButton) {
    await delay(1000);
    launchBotButton.click();
    await resolvePopup(document);
  }
};

const launchNotPixel = async (window, document) => {
  window.location.href = "https://web.telegram.org/k/#@notpixel";
  await delay(5000);

  const launchBotButton = await Promise.any([
    waitForElement(
      document,
      "#column-center > div > div > div.bubbles.has-groups.has-sticky-dates.scrolled-down > div.scrollable.scrollable-y > div.bubbles-inner.has-rights > section > div.bubbles-group.bubbles-group-last > div.bubble.with-reply-markup.hide-name.is-in.can-have-tail.is-group-last > div > div.reply-markup > div:nth-child(1) > a > div"
    ),
    waitForElement(document, "div.new-message-bot-commands.is-view"),
  ]);

  if (launchBotButton) {
    await delay(1000);
    launchBotButton.click();
    await resolvePopup(document);
  }
};

const resolvePopup = async (document) => {
  const popup = await waitForElement(document, "div.popup-container", 3000);

  if (popup) {
    const launchButton = Array.from(popup.querySelectorAll("button")).find((button) => {
      const buttonText = button.querySelector("span").textContent.toLowerCase();
      return buttonText.includes("launch");
    });

    await delay(1000);

    if (launchButton) {
      launchButton.click();
    } else {
      console.warn("Launch button not found in popup");
    }
  }
};

async function clickBrowserHeaderButton(document) {
  const browserHeaderButton = await waitForElement(document, '[class*="_BrowserHeaderButton"]');
  if (browserHeaderButton) {
    browserHeaderButton.click();
  } else {
    console.warn("Browser header element not found");
  }
}

function isEarlierThan(hour) {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // Check if the current time is earlier than 8:00 AM
  if (currentHour < hour || (currentHour === 8 && currentMinute === 0)) {
    return true;
  } else {
    return false;
  }
}

function isLaterThan(hour) {
  const now = new Date();
  const currentHour = now.getHours();

  // Check if the current time is earlier than 8:00 AM
  if (currentHour >= hour) {
    return true;
  } else {
    return false;
  }
}

/** ------------------------------------------------------------------------------- */

const init = async () => {
  await delay(5000); // Wait for window to load

  // 06:00 -> 09:00 or 18:00 -> 23:00
  if ((isLaterThan(6) && isEarlierThan(9)) || (isLaterThan(18) && isEarlierThan(21))) {
    await launchBlum(window, document); // Start Blum
  }

  // 09:00 -> 18:00
  if ((isLaterThan(9) && isEarlierThan(18)) || (isLaterThan(0) && isEarlierThan(6))) {
    const hasNotPixel = await waitForElement(document, 'a[href="#7249432100"]');

    if (hasNotPixel) {
      await launchNotPixel(window, document);
      await delay(6 * 60 * 1000); // Wait 6 min to play
      await clickBrowserHeaderButton(document); // Close NotPixel
      await delay(5000); // Wait window to close
    }
  }
};

init();

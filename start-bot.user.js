// ==UserScript==
// @name        Start bot
// @namespace   Violentmonkey Scripts
// @grant       none
// @version     3.4
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

const launchBot = async (window, document, kBotName, aBotName, botTitle) => {
  const currentBotTitle = await Promise.any([
    // a telegram version
    waitForElement(
      document,
      "#MiddleColumn > div.messages-layout > div.MiddleHeader > div.Transition > div > div > div > div.info > div > h3",
      5000
    ),
    // k telegram version
    waitForElement(
      document,
      "#column-center > div > div > div.sidebar-header.topbar.has-avatar > div.chat-info-container > div.chat-info > div > div.content > div.top > div > span",
      5000
    ),
  ]);

  if (currentBotTitle && currentBotTitle.textContent === botTitle) {
    console.log("Bot title found");
  } else {
    const currentUrl = window.location.href;
    const aBotUrl = `https://web.telegram.org/a#${aBotName}`;
    const kBotUrl = `https://web.telegram.org/k#@${kBotName}`;

    if (currentUrl.includes("https://web.telegram.org/k")) {
      window.location.href = kBotUrl;
    } else {
      window.location.href = aBotUrl;
    }
    return;
  }

  const launchBotButton = await Promise.any([
    // a telegram version
    waitForElement(
      document,
      "#MiddleColumn > div.messages-layout > div.Transition > div > div.middle-column-footer > div.Composer.shown.mounted > div.composer-wrapper > div > button.Button.bot-menu.open.default.translucent.round"
    ),

    // k telegram version
    waitForElement(
      document,
      "#column-center > div > div > div.chat-input.chat-input-main > div > div.rows-wrapper-wrapper > div > div.new-message-wrapper.rows-wrapper-row.has-offset > div.new-message-bot-commands.is-view"
    ),
  ]);

  if (launchBotButton) {
    await delay(1000);
    launchBotButton.click();
    console.warn("launchBotButton clicked");
    // await resolvePopup(document);
  }

  return null;
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
  window.onclick = (e) => {
    console.log(e.target); // to get the element
    console.log(e.target.tagName); // to get the element tag name alone
  };

  await delay(5000); // Wait for window to load

  // 06:00 -> 09:00 or 18:00 -> 23:00
  if ((isLaterThan(6) && isEarlierThan(9)) || (isLaterThan(18) && isEarlierThan(24))) {
    await launchBot(window, document, "BlumCryptoBot", "6865543862", "Blum");
  }

  // 09:00 -> 18:00
  if (isLaterThan(9) && isEarlierThan(18)) {
    const hasBybit = await waitForElement(document, 'a[href="#7326908190"]');

    if (hasBybit) {
      await launchBot(window, document, "BybitCoinsweeper_Bot", "7326908190", "Bybit Coinsweeper");
    }
  }

  // 00:00 -> 06:00
  if (isLaterThan(0) && isEarlierThan(6)) {
    const hasNotPixel = await waitForElement(document, 'a[href="#7249432100"]');

    if (hasNotPixel) {
      await launchBot(window, document, "notpixel", "7249432100", "Not Pixel");
      await delay(1 * 60 * 1000); // Wait 5 min to play
      await clickBrowserHeaderButton(document); // Close NotPixel
      await delay(5000); // Wait window to close
    }
  }
};

init();

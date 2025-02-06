// ==UserScript==
// @name        Start bot
// @namespace   Violentmonkey Scripts
// @grant       none
// @version    6.9
// @author      -
// @description 9/1/2024, 7:13:21 PM
// @match       *://web.telegram.org/*
// @downloadURL https://github.com/vsotreshko/bug-free-happiness/raw/main/start-bot.user.js
// @updateURL   https://github.com/vsotreshko/bug-free-happiness/raw/main/start-bot.user.js
// ==/UserScript==

/** Custom functions -------------------------------------------------------------- */
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const simulateClick = (button) => {
  // Simulate a real mouse click on the launchBotButton
  const rect = button.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  button.dispatchEvent(
    new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: centerX,
      clientY: centerY,
    })
  );

  button.dispatchEvent(
    new MouseEvent("mouseup", {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: centerX,
      clientY: centerY,
    })
  );

  button.dispatchEvent(
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
      clientX: centerX,
      clientY: centerY,
    })
  );

  button.click();
};

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

const launchBot = async (window, document, kBotName, aBotName, botTitles) => {
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

  if (
    currentBotTitle &&
    botTitles.some((title) => currentBotTitle.textContent.trim().toLowerCase() === title.trim().toLowerCase())
  ) {
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
    simulateClick(launchBotButton);

    console.warn("launchBotButton clicked");
    await resolvePopup(document);
  }

  return null;
};

const resolvePopup = async (document) => {
  const popup = await waitForElement(document, "div.popup-container", 3000);

  if (popup) {
    const launchButton = Array.from(popup.querySelectorAll("button")).find((button) => {
      const buttonText = button.querySelector("span").textContent.toLowerCase();
      return buttonText.includes("launch") || buttonText.includes("confirm");
    });

    await delay(1000);

    if (launchButton) {
      simulateClick(launchButton);
    } else {
      console.warn("Launch button not found in popup");
    }
  }

  const modal = await waitForElement(document, "div.modal-dialog", 3000);

  if (modal) {
    const launchButton = Array.from(modal.querySelectorAll("button")).find((button) => {
      const buttonText = button.textContent.toLowerCase();
      return buttonText.includes("launch") || buttonText.includes("confirm");
    });

    await delay(1000);

    if (launchButton) {
      simulateClick(launchButton);
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

const addSymbolToTheName = async (document, symbol) => {
  const burgerSelector = "#LeftMainHeader > div.DropdownMenu.main-menu > button";
  const burger = await waitForElement(document, burgerSelector);
  if (!burger) {
    return;
  }
  simulateClick(burger);

  await delay(1000);

  const menuContainerSelector =
    "#LeftMainHeader > div.DropdownMenu.main-menu > div > div.bubble.menu-container.custom-scroll.with-footer.opacity-transition.fast.left.top.shown.open";
  const menuContainer = await waitForElement(document, menuContainerSelector);
  if (!menuContainer) {
    return;
  }

  for (const item of menuContainer.children) {
    if (item.textContent.includes("Settings")) {
      simulateClick(item);

      await delay(1000);

      const editButtonSelector =
        "#Settings > div.Transition_slide.Transition_slide-active > div.left-header > div > button";
      const editButton = await waitForElement(document, editButtonSelector);
      if (!editButton) {
        return;
      }
      simulateClick(editButton);

      await delay(1000);

      const input = await waitForElement(
        document,
        "#Settings > div.Transition_slide.Transition_slide-active > div.settings-fab-wrapper > div > div.settings-edit-profile.settings-item > div:nth-child(3) > input"
      );

      if (!input || input.value.includes(symbol)) {
        return;
      }

      input.value = input.value + symbol;

      input.dispatchEvent(new Event("input", { bubbles: true }));

      await delay(1000);

      const saveButtonSelector =
        "#Settings > div.Transition_slide.Transition_slide-active > div.settings-fab-wrapper > button";
      const saveButton = await waitForElement(document, saveButtonSelector);
      if (!saveButton) {
        return;
      }
      simulateClick(saveButton);
    }
  }
};

// await launchBot(window, document, "notpixel", "7249432100", "Not Pixel");
// await launchBot(window, document, "PAWSOG_bot", "7200992513", "Paws");

const init = async () => {
  window.onclick = (e) => {
    console.log(e.target); // to get the element
    console.log(e.target.tagName); // to get the element tag name alone
  };

  // await addSymbolToTheName(document, "🦴");
  await addSymbolToTheName(document, "🐶");

  await delay(5000); // Wait for window to load

  // 06:00 -> 09:00 or 21:00 -> 24:00
  // if ((isLaterThan(6) && isEarlierThan(9)) || (isLaterThan(21) && isEarlierThan(24))) {
  // await launchBot(window, document, "dogshouse_bot", "7352918101", ["Dogs 🦴", "dogs"]);
  // } else {
  // await launchBot(window, document, "BlumCryptoBot", "6865543862", ["Blum", "blum"]);
  await launchBot(window, document, "PAWSOG_bot", "7200992513", "Paws");
  // }
};

init();

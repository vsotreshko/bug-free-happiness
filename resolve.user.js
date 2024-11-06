// ==UserScript==
// @name        Blum resolve fix
// @namespace   Violentmonkey Scripts
// @grant       none
// @version     4.1
// @author      -
// @description 9/1/2024, 7:13:21 PM
// @match        *://*paws.community/*
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

const iterateOverTasks = async (document) => {
  const dontResolve = ["connect wallet", "invite 10 friends", "boost paws channel"];

  const questsListSelector =
    "#next-app > div.main-page-con > div.main-content-container.is-show > div.main-content-wrapper > div.quests-tab-con.is-show > div > div.section-items-con.quests";
  const questsList = await waitForElement(document, questsListSelector);

  const elements = questsList.querySelectorAll(".invite-item");
  for (const quest of elements) {
    const text = quest.querySelector(".wallet");
    const shouldntProcess = dontResolve.find((code) => code === text.textContent.trim().toLowerCase());
    if (!shouldntProcess) {
      const button = quest.querySelector(".start-btn");
      if (button) {
        await delay(2000);
        button.click();
      }
    }
  }
};

const resolveEarn = async (document) => {
  console.log("Resolving earn");

  const earnTabSelector =
    "#next-app > div.main-page-con > div.main-content-container.is-show > div.nav-bar-con > div:nth-child(4)";
  const earnTab = await waitForElement(document, earnTabSelector);
  earnTab.click();

  await iterateOverTasks(document); // Start
  await iterateOverTasks(document); // Check
  await iterateOverTasks(document); // Claim

  const partnersTabSelector =
    "#next-app > div.main-page-con > div.main-content-container.is-show > div.main-content-wrapper > div.quests-tab-con.is-show > div > div.type-select > div:nth-child(2)";
  const partnersTab = await waitForElement(document, partnersTabSelector);
  partnersTab.click();

  await iterateOverTasks(document); // Start
  await iterateOverTasks(document); // Check
  await iterateOverTasks(document); // Claim
};

const init = async () => {
  await delay(10000);

  await resolveEarn(document);
};

init();

// ==UserScript==
// @name         Blum Autoclicker fix
// @version      7.0
// @namespace    Violentmonkey Scripts
// @author       mudachyo
// @match        https://telegram.blum.codes/*
// @grant        none
// @icon         https://cdn.prod.website-files.com/65b6a1a4a0e2af577bccce96/65ba99c1616e21b24009b86c_blum-256.png
// @downloadURL  https://github.com/vsotreshko/bug-free-happiness/raw/main/main.user.js
// @updateURL    https://github.com/vsotreshko/bug-free-happiness/raw/main/main.user.js
// ==/UserScript==

const verifyWithCodes = [
  { title: "Crypto Regulations #2", code: "BLUMRULES" },
  { title: "DEX History", code: "GODEX" },
  { title: "What's next for Defi?", code: "BLUMNOW" },
  { title: "What is Slippage?", code: "CRYPTOBUZZ" },
  { title: "Understanding Gas Fees", code: "CRYPTOGAS" },
  { title: "Regulation: Yay or Nay?", code: "BLUMSSS" },
  { title: "Smart Contracts 101", code: "SMARTBLUM" },
  { title: "P2P Trading Safety Tips", code: "BLUMTIPS" },
  { title: "What’s Next for DeFi?", code: "BLUMNOW" },
  { title: "Crypto Slang. Part 3", code: "BOOBLUM" },
  { title: "Crypto Slang. Part 4", code: "LAMBOBLUM" },

  { title: "Blum CMO @ Blockchain Life", code: "BLUMISLIFE" },
  { title: "Dex History #3", code: "LOVEBLUM" },
  { title: "P2P Trading Safety Tips", code: "BLUMTIPS" },
  { title: "Crypto Regulations #2", code: "BLUMRULES" },

  { title: "Future of Telegram. Part 1", code: "TAPBLUM" },
  { title: "Blum COO @ Blockchain Life", code: "LIFEISBLUM" },
  { title: "History of Bitcoin", code: "BIGPIZZA" },
  { title: "Crypto Slang. Part 5", code: "GONNABLUM" },
  { title: "What is Uniswap?", code: "BLUMSHINE" },
  { title: "Crypto in Everyday Life", code: "BLUMANCE" },
  { title: "Memepad Tutorial", code: "MEMEPAD" },
  { title: "Dex Evolution", code: "Blumspark" },
  { title: "Is Binance a DEX?", code: "BLUMIES" },
  { title: "Crypto Communities", code: "BLUMMUNITY" },

  { title: "Dec 20 News", code: "Trump" },
  { title: "Dec 18 News", code: "Mark" },
  { title: "Dec 17 News", code: "Kendrick" },
  { title: "Dec 16 News", code: "BITCOIN" },
  { title: "Dec 13 News", code: "BITCOINJESUS" },
  { title: "Dec 12 News", code: "RIPPLE" },
  { title: "Dec 6 Crypto News", code: "Hundred" },
];
/** Custom functions -------------------------------------------------------------- */
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
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

function executeWithProbability(code, probability = 0.05) {
  if (Math.random() < probability) {
    code();
  }
}
/** ------------------------------------------------------------------------------- */

const playGame = async () => {
  (() => {
    if (window.BlumAC) return;

    window.BlumAC = true;
    let gamesCounter = 0;
    const config = {
      autoPlay: true,
      maxGamesInRow: 6,
      orangeColor: [226, 122, 52],
      greenColor: [208, 216, 0],
      whiteColor: [255, 255, 255],
      bombColor: [126, 119, 121],
      flowerTolerance: 9,
      iceTolerance: 9,
      bombTolerance: 9,
      playButtonSelector: "button.is-primary, .play-btn",
      canvasSelector: "canvas",
      playCheckInterval: 2500,
      objectCheckInterval: 100,
      excludedArea: { top: 70, bottom: 50 },
      startGameDelay: 1000,
      flowerClickProbability: 1,
      iceClickProbability: 1,
      // Add configuration for surrounding pixel check
      surroundingPixelRadius: 1, // Check pixels within this radius
      matchThreshold: 0.6, // Percentage of matching surrounding pixels required
    };

    if (config.autoPlay) {
      setInterval(() => {
        if (gamesCounter >= config.maxGamesInRow) return;
        const playButton = document.querySelector(config.playButtonSelector);
        if (playButton && playButton.textContent.toLowerCase().includes("play")) {
          playButton.click();
          gamesCounter++;
          setTimeout(() => {
            startAutoClick();
          }, config.startGameDelay);
        }
      }, config.playCheckInterval);
    }

    function startAutoClick() {
      setInterval(() => {
        const canvas = document.querySelector(config.canvasSelector);
        if (canvas) detectAndClickObjects(canvas);
      }, config.objectCheckInterval);
    }

    // Helper function to check surrounding pixels
    function checkSurroundingPixels(pixels, width, height, centerX, centerY, targetColor, tolerance) {
      let matchCount = 0;
      let totalChecked = 0;
      const radius = config.surroundingPixelRadius;

      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const x = centerX + dx;
          const y = centerY + dy;

          // Skip if outside canvas bounds
          if (x < 0 || x >= width || y < 0 || y >= height) continue;

          const index = (y * width + x) * 4;
          const [r, g, b] = [pixels[index], pixels[index + 1], pixels[index + 2]];

          totalChecked++;
          if (isColorSuits(r, g, b, targetColor, tolerance)) {
            matchCount++;
          }
        }
      }

      return matchCount / totalChecked >= config.matchThreshold;
    }

    function detectAndClickObjects(canvas) {
      const { width, height } = canvas;
      const context = canvas.getContext("2d");
      const imageData = context.getImageData(0, 0, width, height);
      const pixels = imageData.data;

      let loopShouldWork = true;

      for (let y = config.excludedArea.top; y < height - config.excludedArea.bottom; y++) {
        // if (!loopShouldWork) break;

        for (let x = 0; x < width; x++) {
          const index = (y * width + x) * 4;
          const [r, g, b] = [pixels[index], pixels[index + 1], pixels[index + 2]];

          // Check current pixel and surrounding area for each color
          if (isColorSuits(r, g, b, config.bombColor, config.bombTolerance)) {
            simulateClick(canvas, x, y);
            loopShouldWork = false;
            break;
          }

          if (isColorSuits(r, g, b, config.greenColor, config.flowerTolerance)) {
            simulateClick(canvas, x, y);
            loopShouldWork = false;
            break;
          }

          if (isColorSuits(r, g, b, config.orangeColor, config.flowerTolerance)) {
            simulateClick(canvas, x, y);
            loopShouldWork = false;
            break;
          }

          if (isColorSuits(r, g, b, config.whiteColor, config.iceTolerance)) {
            simulateClick(canvas, x, y);
            loopShouldWork = false;
            break;
          }
        }
      }
    }

    function isColorSuits(r, g, b, greenColor, tolerance) {
      const gc = greenColor;
      const t = tolerance;
      const greenRange =
        gc[0] - t < r && r < gc[0] + t && gc[1] - t < g && g < gc[1] + t && gc[2] - t < b && b < gc[2] + t;

      return greenRange;
    }

    function simulateClick(canvas, x, y) {
      const eventProps = { clientX: x, clientY: y, bubbles: true };
      ["click", "mousedown", "mouseup"].forEach((event) => {
        canvas.dispatchEvent(new MouseEvent(event, eventProps));
      });
    }
  })();
};

const iterateOverTaskItems = async (taskItems, action) => {
  if (action === "start" || action === "claim") {
    for (const taskItem of taskItems) {
      // Find and click the div with text "Start" inside the task item
      const startDiv = taskItem.querySelector("div.label");
      if (startDiv && startDiv.textContent.trim().toLowerCase() === action) {
        startDiv.scrollIntoView();
        startDiv.click();
        await delay(getRandomInt(2000, 3000)); // Wait for potential action to complete
      }
    }
  }

  if (action === "verify") {
    for (const taskItem of taskItems) {
      const startDiv = taskItem.querySelector("div.label");

      if (startDiv && startDiv.textContent.trim().toLowerCase() === "verify") {
        console.log(taskItem);

        const title = taskItem.querySelector("div.title");
        const taskTitle = title?.textContent.trim().toLowerCase();

        const verifyWithCode = verifyWithCodes.find(
          (code) => code.title.trim().toLowerCase() === taskTitle.trim().toLowerCase()
        );

        if (verifyWithCode) {
          startDiv.scrollIntoView();
          startDiv.click();
          const verifyPage = await waitForElement(document, "div.pages-tasks-verify");

          if (verifyPage) {
            const verifyPageTitle = await waitForElement(
              verifyPage,
              "div.pages-tasks-verify > div.heading > div.title"
            );
            if (
              verifyPage &&
              verifyPageTitle.textContent.trim().toLowerCase() === verifyWithCode.title.trim().toLowerCase()
            ) {
              console.log(verifyPageTitle);
              const input = await waitForElement(verifyPage, "input[type=text]");

              await delay(getRandomInt(1000, 2000));
              input.value = verifyWithCode.code;
              input.dispatchEvent(new Event("input", { bubbles: true }));
              await delay(getRandomInt(1000, 2000));

              const submitButton = await waitForElement(verifyPage, "button.kit-button.is-large");

              if (submitButton) {
                submitButton.click();
                await delay(getRandomInt(2000, 3000));
              }
            }
          }
        }
      }
    }
  }
};

const claimProof = async (document) => {
  const buttonSelector =
    "#app > div.tasks-page.page > div.sections > div:nth-child(2) > div.pages-tasks-list.is-short-card > div:nth-child(1) > div > div.footer > button";
  const button = await waitForElement(document, buttonSelector);
  button.click();
};

const processWeeklyTasks = async (document) => {
  const weekly = await waitForElement(
    document,
    "#app > div.tasks-page.page > div.sections > div:nth-child(2) > div.pages-tasks-list.is-short-card > div > div > div.footer > button"
  );
  if (weekly) {
    weekly.click();
    const weeklyPage = await waitForElement(document, "body > div.kit-bottom-sheet > dialog"); // Get all task items

    if (weeklyPage) {
      const weeklyTaskItems = weeklyPage.querySelectorAll(".pages-tasks-list-item-label"); // Get all task items
      await iterateOverTaskItems(weeklyTaskItems, "start"); // Start all
      await iterateOverTaskItems(weeklyTaskItems, "verify"); // Verify if needed
      await iterateOverTaskItems(weeklyTaskItems, "claim"); // Claim all
    }

    const closeWeeklyButton = await waitForElement(
      document,
      "body > div.kit-bottom-sheet > dialog > div.header-with-banner > div > div.right-slot > button"
    );
    if (closeWeeklyButton) {
      closeWeeklyButton.click();
    }
  }
};

const resolveTasks = async (document) => {
  await delay(getRandomInt(3000, 5000)); // Wait page for load

  // await claimProof(document);

  const tabSelectors = [
    "#app > div.tasks-page.page > div.sections > div:nth-child(3) > div > div.kit-tabs-inline.is-fully-left-scrolled > div.content > div > label:nth-child(2)", // New
    // "div.tasks-page.page > div.sections > div:nth-child(3) > div > div.kit-tabs > div.content > div > label:nth-child(3) > span", // OnChain
    "#app > div.tasks-page.page > div.sections > div:nth-child(3) > div > div.kit-tabs-inline.is-fully-left-scrolled > div.content > div > label:nth-child(4)", // Socials
    "#app > div.tasks-page.page > div.sections > div:nth-child(3) > div > div.kit-tabs-inline.is-fully-left-scrolled > div.content > div > label:nth-child(5) > span", // Blum bits
    "#app > div.tasks-page.page > div.sections > div:nth-child(3) > div > div.kit-tabs-inline.is-fully-left-scrolled > div.content > div > label:nth-child(6)", // Academy
  ];

  for (const tabSelector of tabSelectors) {
    const tab = document.querySelector(tabSelector);
    tab.click();
    await delay(getRandomInt(1000, 3000)); // Wait page for load

    const tasksContainerSelector =
      "#app > div.tasks-page.page > div.sections > div:nth-child(3) > div > div.tasks-list";
    const tasksContainer = await waitForElement(document, tasksContainerSelector);
    const taskItems = tasksContainer.querySelectorAll(".pages-tasks-item"); // Get all task items

    await iterateOverTaskItems(taskItems, "start"); // Start all
    await iterateOverTaskItems(taskItems, "verify"); // Verify if needed
    await iterateOverTaskItems(taskItems, "claim"); // Claim all
  }
};

const openTab = async (tabName) => {
  const homeTabSelector = "#app > div.layout-tabs.tabs > a:nth-child(1)";
  const earnTabSelector = "#app > div.layout-tabs.tabs > a:nth-child(2)";
  const frensTabSelector = 'a[href*="/frens"]';
  let tab = undefined;

  switch (tabName) {
    case "home":
      tab = await waitForElement(document, homeTabSelector);
      break;
    case "earn":
      tab = await waitForElement(document, earnTabSelector);
      break;
    case "frens":
      tab = await waitForElement(document, frensTabSelector);
      break;
  }

  if (tab) {
    tab.click();
  }
};

const init = async () => {
  // Find "Continue" button
  const continueButton = await waitForElement(document, "button.kit-button.is-large.is-fill", 3000);
  if (continueButton) {
    await delay(2000);
    continueButton.click();
  }

  await openTab("home");
  await delay(getRandomInt(1000, 3000));

  const dayClaimSelector =
    "#app > div.index-page.page > div > div.profile-with-balance > div.pages-index-widgets.widgets > div.pages-index-widgets-daily-reward.widget > div > button";
  const dayClaim = await waitForElement(document, dayClaimSelector, 2000);
  if (dayClaim) {
    await delay(getRandomInt(3000, 5000));
    dayClaim.click();
  }

  await openTab("earn");
  await delay(getRandomInt(1000, 3000));

  await resolveTasks(document);

  await openTab("frens");
  await delay(getRandomInt(1000, 3000));

  // Claim frens
  const frensClaim = await waitForElement(document, "button.claim-button", 2000);
  if (frensClaim) {
    await delay(getRandomInt(3000, 5000));
    frensClaim.click();
  }

  await openTab("home");
  await delay(getRandomInt(1000, 3000));

  const startFarming = await waitForElement(document, "button.kit-button.is-large.is-fill.button");
  if (startFarming) {
    startFarming.click();
  }

  // playGame();
};

init();
/** ------------------------------------------------------------------------------- */

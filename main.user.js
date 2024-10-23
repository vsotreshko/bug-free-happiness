// ==UserScript==
// @name         Blum Autoclicker fix
// @version      5.3
// @namespace    Violentmonkey Scripts
// @author       mudachyo
// @match        https://telegram.blum.codes/*
// @grant        none
// @icon         https://cdn.prod.website-files.com/65b6a1a4a0e2af577bccce96/65ba99c1616e21b24009b86c_blum-256.png
// @downloadURL  https://github.com/vsotreshko/bug-free-happiness/raw/main/main.user.js
// @updateURL    https://github.com/vsotreshko/bug-free-happiness/raw/main/main.user.js
// ==/UserScript==

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
      greenColor: [208, 216, 0],
      whiteColor: [255, 255, 255],
      bombColor: [126, 119, 121],
      flowerTolerance: 9,
      iceTolerance: 5,
      bombTolerance: 5,
      playButtonSelector: "button.is-primary, .play-btn",
      canvasSelector: "canvas",
      playCheckInterval: 2500,
      objectCheckInterval: 100,
      excludedArea: { top: 70, bottom: 50 },
      startGameDelay: 1000,
      flowerClickProbability: 1,
      iceClickProbability: 0.9,
      // Add configuration for surrounding pixel check
      surroundingPixelRadius: 2, // Check pixels within this radius
      matchThreshold: 0.6, // Percentage of matching surrounding pixels required
    };

    if (config.autoPlay && gamesCounter <= config.maxGamesInRow) {
      setInterval(() => {
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
        if (!loopShouldWork) break;

        for (let x = 0; x < width; x++) {
          const index = (y * width + x) * 4;
          const [r, g, b] = [pixels[index], pixels[index + 1], pixels[index + 2]];

          // Check current pixel and surrounding area for each color
          if (
            isColorSuits(r, g, b, config.bombColor, config.bombTolerance) &&
            checkSurroundingPixels(pixels, width, height, x, y, config.bombColor, config.bombTolerance)
          ) {
            executeWithProbability(() => {
              simulateClick(canvas, x, y);
            }, config.flowerClickProbability);

            loopShouldWork = false;
            break;
          }

          if (
            isColorSuits(r, g, b, config.greenColor, config.flowerTolerance) &&
            checkSurroundingPixels(pixels, width, height, x, y, config.greenColor, config.flowerTolerance)
          ) {
            executeWithProbability(() => {
              simulateClick(canvas, x, y);
            }, config.flowerClickProbability);

            loopShouldWork = false;
            break;
          }

          if (
            isColorSuits(r, g, b, config.whiteColor, config.iceTolerance) &&
            checkSurroundingPixels(pixels, width, height, x, y, config.whiteColor, config.iceTolerance)
          ) {
            executeWithProbability(() => {
              simulateClick(canvas, x, y);
            }, config.iceClickProbability);

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
  const verifyWithCodes = [
    { title: "$2.5m+ dogs airdrop", code: "HAPPYDOGS" },
    { title: "liquidity pools guide", code: "Blumersss" },
    { title: "what are amms?", code: "CRYPTOSMART" },
    { title: "say no to rug pull!", code: "SUPERBLUM" },
    { title: "what are telegram mini apps?", code: "CRYPTOBLUM" },
    { title: "navigating crypto", code: "HEYBLUM" },
    { title: "secure your crypto!", code: "BEST PROJECT EVER" },
    { title: "forks explained", code: "GO GET" },
    { title: "how to analyze crypto?", code: "VALUE" },
    { title: "doxxing? what's that?", code: "NODOXXING" },
    // { title: "pre-market trading?", code: "WOWBLUM" }, // TODO: Not working
    { title: "how to memecoin?", code: "MEMEBLUM" },
    { title: "crypto terms. part 1", code: "BLUMEXPLORER" },
    { title: "bitcoin rainbow chart", code: "SOBLUM" },
    { title: "token burning: how & why?", code: "ONFIRE" },
    { title: "how to trade perps?", code: "CRYPTOFAN" },
    { title: "sharding explained", code: "BLUMTASTIC" },
    { title: "defi explained", code: "BLUMFORCE" },
    { title: "how to find altcoins?", code: "ULTRABLUM" },
    { title: "crypto slang. part 1", code: "BLUMSTORM" },
    { title: "bitcoin rainbow chart?", code: "SOBLUM" },
  ];

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
        const title = taskItem.querySelector("div.title");
        const taskTitle = title?.textContent.trim().toLowerCase();

        const verifyWithCode = verifyWithCodes.find((code) => code.title === taskTitle);

        if (verifyWithCode) {
          startDiv.scrollIntoView();
          startDiv.click();
          const verifyPage = await waitForElement(document, "div.pages-tasks-verify");

          if (verifyPage) {
            const verifyPageTitle = await waitForElement(
              verifyPage,
              "div.pages-tasks-verify > div.heading > div.title"
            );
            if (verifyPage && verifyPageTitle.textContent.trim().toLowerCase() === verifyWithCode.title) {
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

const resolveTasks = async (document) => {
  // Open Tasks tab
  const tasksTab = await waitForElement(document, 'a[href*="/tasks"]');
  if (tasksTab) {
    await delay(getRandomInt(3000, 5000)); // Wait page for load
    tasksTab.click();
  }

  await delay(getRandomInt(3000, 5000)); // Wait page for load

  const weekly = await waitForElement(
    document,
    "#app > div.tasks-page.page > div.sections > div:nth-child(2) > div.pages-tasks-list.is-short-card > div > div > div.footer > button"
  );

  if (weekly) {
    weekly.click();
    const weeklyPage = await waitForElement(
      document,
      "#app > div.tasks-page.page > div.sections > div:nth-child(2) > div.pages-tasks-list.is-short-card > div > div.kit-bottom-sheet > dialog"
    ); // Get all task items
    if (weeklyPage) {
      const weeklyTaskItems = weeklyPage.querySelectorAll(".pages-tasks-list-item-label"); // Get all task items
      await iterateOverTaskItems(weeklyTaskItems, "start"); // Start all
      await iterateOverTaskItems(weeklyTaskItems, "verify"); // Verify if needed
      await iterateOverTaskItems(weeklyTaskItems, "claim"); // Claim all
    }

    const closeWeeklyButton = await waitForElement(
      document,
      "#app > div.tasks-page.page > div.sections > div:nth-child(2) > div.pages-tasks-list.is-short-card > div > div.kit-bottom-sheet > dialog > div.header-with-banner > div > div.right-slot > button"
    );
    if (closeWeeklyButton) {
      closeWeeklyButton.click();
    }
  }

  const tabSelectors = [
    "div.tasks-page.page > div.sections > div:nth-child(3) > div > div.kit-tabs > div.content > div > label:nth-child(2) > span", // New
    // "div.tasks-page.page > div.sections > div:nth-child(3) > div > div.kit-tabs > div.content > div > label:nth-child(3) > span", // OnChain
    // "div.tasks-page.page > div.sections > div:nth-child(3) > div > div.kit-tabs > div.content > div > label:nth-child(4) > span", // Socials
    "div.tasks-page.page > div.sections > div:nth-child(3) > div > div.kit-tabs > div.content > div > label:nth-child(5) > span", // Academy
  ];
  for (const tabSelector of tabSelectors) {
    const tab = document.querySelector(tabSelector);
    tab.click();
    await delay(getRandomInt(3000, 5000)); // Wait page for load
    const taskItems = document.querySelectorAll(".pages-tasks-item"); // Get all task items
    await iterateOverTaskItems(taskItems, "start"); // Start all
    await iterateOverTaskItems(taskItems, "verify"); // Verify if needed
    await iterateOverTaskItems(taskItems, "claim"); // Claim all
  }
};

const init = async () => {
  await delay(5000);

  // Find "Continue" button
  const continueButton = await waitForElement(document, "button.kit-button.is-large.is-fill");
  if (continueButton) {
    await delay(getRandomInt(3000, 5000));
    continueButton.click();
  }

  // Claim / Continue / Start
  const claimButton = await waitForElement(document, "button.kit-button.is-large.is-fill.button");
  if (claimButton) {
    await delay(getRandomInt(3000, 5000));
    claimButton.click();
  }
  // await resolveTasks(document);

  // // Open Frens tab
  // const frensTab = await waitForElement(document, 'a[href*="/frens"]');
  // if (frensTab) {
  //   frensTab.click();
  // }
  // await delay(getRandomInt(3000, 5000)); // Wait after click

  // // Claim frens
  // const frensClaim = await waitForElement(document, "button.claim-button", 2000);
  // if (frensClaim) {
  //   await delay(getRandomInt(3000, 5000));
  //   frensClaim.click();
  // }
  // await delay(getRandomInt(3000, 5000)); // Wait after click

  // // Open Home tab
  // const homeTab = await waitForElement(document, 'a[href*="/"]');
  // if (homeTab) {
  //   homeTab.click();
  // }
  // await delay(getRandomInt(3000, 5000)); // Wait after click

  // // Claim / Continue / Start
  // const startFarming = await waitForElement(document, "button.kit-button.is-large.is-fill.button");
  // if (startFarming) {
  //   startFarming.click();
  // }

  playGame();
};

init();
/** ------------------------------------------------------------------------------- */

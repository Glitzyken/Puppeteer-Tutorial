const fs = require("fs");
const puppeteer = require("puppeteer");

(async () => {
  try {
    // Initialize Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Specify comic issue page url
    await page.goto(
      "https://comicpunch.net/readme/index.php?title=batman-the-adventures-continue-2020&chapter=1"
    );
    console.log("page has been loaded!");

    // While page is waiting for 1s, click on the 'Full Chapter' button and do the rest
    await page.waitFor(1000);
    await page.click("button.button4");
    console.log("'Full Chapter' button has been clicked!");

    // Evaluate/Compute the main task:
    // Here, we convert the nodelist of images returned from the dom into an array, then map each item and get the src attribute value, and store it in 'srcs' variable, which is therefore returned to be the value of 'issueSrcs' variable.
    const issueSrcs = await page.evaluate(() => {
      const srcs = Array.from(
        document.querySelectorAll(".comicpic")
      ).map((image) => image.getAttribute("src"));
      return srcs;
    });
    console.log("Page has been evaluated!");

    // Persist data into data.json file
    fs.writeFileSync("./data.json", JSON.stringify(issueSrcs));
    console.log("File is created!");

    // End Puppeteer
    await browser.close();
  } catch (error) {
    console.log(error);
  }
})();

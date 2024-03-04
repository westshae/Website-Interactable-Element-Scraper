const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function scrapePages(links) {
  const browser = await puppeteer.launch();

  for (const link of links) {
    try {
      const pageUrl = link;
      const folderName = pageUrl.replace(/(^\w+:|^)\/\//, '').replace(/\//g, '_');
      const folderPath = path.join('./data/websites', folderName);

      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      const page = await browser.newPage();
      await page.goto(pageUrl);

      await page.setViewport({
        width: 1920,
        height: await page.evaluate(() => document.body.scrollHeight)
      });

      const screenshotPath = path.join(folderPath, 'screenshot.png');
      await page.screenshot({
        path: screenshotPath,
        fullPage: true
      });

      const htmlContent = await page.content();
      fs.writeFileSync(path.join(folderPath, 'index.html'), htmlContent);

      console.log(`Saved screenshot and HTML for ${pageUrl}`);

      const boundingBoxes = await page.evaluate(() => {
        const elements = document.querySelectorAll('*');
        const bounds = [];
        elements.forEach(element => {
          const rect = element.getBoundingClientRect();
          bounds.push({
            tagName: element.tagName.toLowerCase(),
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height
          });
        });
        return bounds;
      });

      const boundingBoxFilePath = path.join(folderPath, 'bounding_boxes.json');
      fs.writeFileSync(boundingBoxFilePath, JSON.stringify(boundingBoxes, null, 2));

      console.log(`Saved bounding box data for ${pageUrl}`);

      const drawBoundingBoxes = require('./drawBoundingBoxes');
      await drawBoundingBoxes(screenshotPath, boundingBoxFilePath, path.join(folderPath, 'annotated_screenshot.png'));

      console.log(`Annotated screenshot created for ${pageUrl}`);

      await page.close();
    } catch (e) {
      console.log(e);
    }
  }

  await browser.close();
}

module.exports = scrapePages;

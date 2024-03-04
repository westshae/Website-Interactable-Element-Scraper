const scrapePages = require('./savewebsites');
const links = require('../data/links.json');

(async () => {
  try {
    await scrapePages(links);
    console.log('Scraping completed successfully.');
  } catch (error) {
    console.error('Error occurred during scraping:', error);
  }
})();

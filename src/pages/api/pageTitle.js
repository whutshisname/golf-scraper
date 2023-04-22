/* import puppeteer from 'puppeteer';

async function getPageTitle(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  const pageTitle = await page.$eval('h1#page-title', (el) => el.innerText.trim());
  await browser.close();
  return pageTitle;
}

export default async function handler(req, res) {
  const { pageUrl } = req.query;

  try {
    const pageTitle = await getPageTitle(pageUrl);
    res.status(200).json({ pageTitle });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch page title' });
  }
}
 */
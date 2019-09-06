const faker = require('faker');
const puppeteer = require('puppeteer');

const person = {
  name: faker.name.firstName() + ' ' + faker.name.lastName(),
  email: faker.internet.email(),
  phone: faker.phone.phoneNumber(),
  message: faker.random.words(),
  password: faker.random.word(),
};

const appUrlBase = 'http://localhost:3002'
const routes = {
  public: {
    login: `${appUrlBase}/login`,
    noMatch: `${appUrlBase}/PageNotFound`,
  },
  private: {
    dashboard: `${appUrlBase}/`,
    registration: `${appUrlBase}/registration`,
  },
};

describe('Signing In', () => {
  test('sign-in title loads correctly', async () => {
    let browser = await puppeteer.launch({
      headless: false
    });
    let page = await browser.newPage();

    page.emulate({
      viewport: {
        width: 1366,
        height: 768
      },
      userAgent: ''
    });

    await page.goto('http://localhost:3000/');
    await page.waitForSelector('.header');

    const html = await page.$eval('.header', e => e.innerHTML);
    expect(html).toBe('sign in');

    browser.close();
  }, 16000);
});

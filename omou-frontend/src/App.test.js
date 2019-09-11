const puppeteer = require('puppeteer');
const faker = require('faker');

const person = {
  name: faker.name.firstName() + ' ' + faker.name.lastName(),
  email: "calvin@email.com",
  phone: faker.phone.phoneNumber(),
  message: faker.random.words(),
  password: "password"
};


const isDebugging = () => {
  let debugging_mode = {
    headless: false,
    slowMo: 50,
    devtools: true,
  };
  return process.env.NODE_ENV === 'debug' ? debugging_mode : {};
};

let browser;
let page;
beforeAll(async () => {
  browser = await puppeteer.launch(isDebugging());
  page = await browser.newPage();
  await page.goto('http://localhost:3000/');
  page.emulate({
    viewport: {
      width: 1366,
      height: 768
    },
    userAgent: ''
  });

});



const appUrlBase = 'http://localhost:3000'
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

    await page.goto('http://localhost:3000/');
    await page.waitForSelector('.header');

    const html = await page.$eval('.header', e => e.innerHTML);
    expect(html).toBe('sign in');


  }, 16000);
  test('login form works correctly', async () => {

    await page.click('.email')
    await page.type('.email', person.email)
    await page.click('.password')
    await page.type('.password', person.password)
    await page.click('.remember')
    await page.click('.signIn')

    const html = await page.$eval('.Navigation', e => e.innerHTML);
    expect(html).toBe('.Navigation')

    browser.close();
  }, 16000)
}
);

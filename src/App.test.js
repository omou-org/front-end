const puppeteer = require('puppeteer');
const faker = require('faker');

const person = {
  name: faker.name.firstName() + ' ' + faker.name.lastName(),
  email: "c@lvin.com",
  phone: faker.phone.phoneNumber(),
  message: faker.random.words(),
  password: "password"
};



let browser;
let page;
const width = 1920;
const height = 1080;

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: false,
    slowMo: 80,
    args: [`--window-size=${width},${height}`]
  });
  page = await browser.newPage();
  await page.setViewport({ width, height });
});
afterAll(() => {
  browser.close();
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

    await page.goto(routes.public.login);
    await page.waitForSelector('.header');

    const html = await page.$eval('.header', e => e.innerHTML);
    expect(html).toBe('sign in');


  }, 16000);
  test('login form works correctly', async () => {
    // take a png screenshot and saves it inside root directory
    await page.screenshot({ path: "loginScreen.png" })
    // uses faker to load data from object uptop
    await page.goto(routes.public.login);
    await page.click('.email')
    await page.type('.email', person.email)
    await page.click('.password')
    await page.type('.password', person.password)
    await page.click('.remember')
    await page.click('.signIn')

    //This is supposed to show Dashboard, but can't find selector of `Dashboard`
    const html = await page.$eval('`Dashboard`', e => e.innerHTML);

    expect(html).toBe('Dashboard')

  }, 16000)
}
);

describe('Register', () => {
  // xtest means skip this test
  xtest('Go to register page click on tutoring and click 6th grade math ', async () => {
    await page.goto(routes.private.registration);
    await page.click('a[href$="/registration/form/course/1"]')
    await page.screenshot({ png: "register.png" })


  })
})
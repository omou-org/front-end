const puppeteer = require('puppeteer');
const faker = require('faker');

// Uses faker to set inital "person" object, This can be used whenever you need to fill in a form with any param inside the object.
const person = {
  name: `${faker.name.firstName()} ${faker.name.lastName()}`,
  email: "c@lvin.com",
  phone: faker.phone.phoneNumber(),
  message: faker.random.words(),
  password: "password"
};


// Inital setup for pupeteer
let browser;
let page;
const width = 1920;
const height = 1080;

// Setup before any test is run, launches puppeteer with the window sizes & heigh
beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: true,
    args: [`--window-size=${width},${height}`]
  });
  page = await browser.newPage();
  await page.setViewport({ width, height });
});
// after all tests are complete close the browser
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


  }, 160000000);
  test('login form leads to the dashboard', async () => {

    // you will need to find the exact path for the screen shots to save in the file. 

    await page.screenshot({ path: "debug_screenshots/test.png" })
    // Uses faker to load data from object uptop
    await page.goto(routes.public.login);
    await page.click('.email')
    await page.type('.email', person.email)
    await page.click('.password')
    await page.type('.password', person.password)
    await page.click('.remember')
    await page.click('.signIn')
    await page.waitFor(".Navigation")

    //This will test if the path is "/"
    expect(window.location.pathname).toBe('/')

  }, 16000000)
}
);

describe('Register', () => {
  // xtest means skip this test
  xtest('Go to register page click on tutoring and click 6th grade math ', async () => {
    await page.goto(routes.private.registration);
    await page.click('a[href$="/registration/form/course/1"]')
    await page.screenshot({ path: "debug_screenshots/register.png" })


  })
})
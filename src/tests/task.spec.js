// @ts-check
const { test, expect } = require("@playwright/test");
const { SelectSeatsPage: SelectYourOwnSeatPage } = require("../pages/syos");
const { SYOSModalComponent } = require("../pages/components/syosModal");
const {
  getTextFromElement,
  convertNumberToCurrencyString,
  convertStringToHaveDashAndSpace,
} = require("../pages/helper/uiHelper");
const { Cart } = require("../pages/cart");
const { DonationModalComponent } = require("../pages/components/donationModal");

test.describe("Automation flow task: ", () => {
  test.beforeEach(async ({ page }) => {
    // await page.goto('https://my.laphil.com/en/syos2/performance/8928');
    // Started my work on this URL, but later switched to other
    await page.goto("https://my.laphil.com/en/syos2/package/1203");
  });

  test("Scenario 1", async ({ page }) => {
    const syos = new SelectYourOwnSeatPage(page);
    const modal = new SYOSModalComponent(page);

    await expect(page).toHaveTitle("Select Your Own Seat | LA Phil");
    await expect.soft(syos.base).toBeVisible();
    await expect.soft(syos.inputGroupNumber).toBeVisible();
    await expect
      .soft(syos.performanceDetailsTitle)
      .toHaveText("Thursday Evenings 1 (TH1 / 7 Concerts)");

    await expect.soft(syos.ticketQuantityInput).toHaveValue("2");
    await syos.incrementTickets(4);
    await expect.soft(syos.ticketQuantityInput).toHaveValue("6");

    const sectorsNumbers = await syos.allAvailableSectorTypes.count();
    console.log("allAvailableSectorTypes - count: ", sectorsNumbers);

    //  Can be viewed in HTLM report of the Playwright.
    test.info().annotations.push({
      type: "Total number of Available sectors",
      description: sectorsNumbers.toString(),
    });

    const namedActiveSectors = await syos.getNamesOfAvailableSectorNames();
    console.log("getNamesOfAvailableSectorNames - count: ", namedActiveSectors);

    //  Can be viewed in HTLM report of the Playwright.
    test.info().annotations.push({
      type: "Available Sector Names",
      description: namedActiveSectors.toString(),
    });

    const resultMap = new Map();

    async function checkSeatsAvailability(number) {
      await test.step(`Process Number ${number}`, async () => {
        const seatPriceLineItem = syos.seatPriceLineItem.nth(0);
        const modalBackdrop = modal.backdrop;

        await syos.clickAtDesiredArea(number);
        /* ! Without this wait - ticket numbers are counted as default "2",
          and test result is that - tickets together are available */
        await page.waitForTimeout(300);
        await syos.continueBtnClick();

        let waitForElements;
        if (
          (await seatPriceLineItem.isVisible()) ||
          (await modalBackdrop.isVisible())
        ) {
          waitForElements = Promise.resolve();
        } else {
          waitForElements = Promise.race([
            seatPriceLineItem.waitFor(),
            modalBackdrop.waitFor(),
          ]);
        }

        try {
          await Promise.race([waitForElements, page.waitForTimeout(7000)]); //Will wait less, if elements are there
        } catch (error) {
          console.error("Neither element is visible within the timeout.");
          resultMap.set(
            number,
            `${namedActiveSectors[number]}: Something went wrong!`,
          );
          return;
        }

        if (await seatPriceLineItem.isVisible()) {
          resultMap.set(
            number,
            `${namedActiveSectors[number]}: There are seats together`,
          );

          await syos.backBtnClick();
          await modal.confirmModalComponent();
        } else if (await modalBackdrop.isVisible()) {
          resultMap.set(
            number,
            `${namedActiveSectors[number]}: There are NO seats together`,
          );
          await modal.closeModalComponent();
        } else {
          resultMap.set(
            number,
            `${namedActiveSectors[number]}: Something went wrong!`,
          );
          await syos.backBtnClick();
          await modal.confirmModalComponent();
        }

        await syos.priceTypesEl.waitFor();
      });
    }

    for (let i = 0; i < namedActiveSectors.length; i++) {
      await checkSeatsAvailability(i);
    }

    console.log("resultMap: ", resultMap);

    //  Can be viewed in HTLM report of the Playwright.
    test.info().annotations.push({
      type: "Sections and availability",
      description: Array.from(resultMap, ([k, v]) => `[${k} - ${v}]`).join(
        ", ",
      ),
    });
  });

  test("Scenario 2", async ({ page }) => {
    const syos = new SelectYourOwnSeatPage(page);
    const cart = new Cart(page);
    const donation = new DonationModalComponent(page);

    await expect(page).toHaveTitle("Select Your Own Seat | LA Phil");
    await expect
      .soft(syos.performanceDetailsTitle)
      .toHaveText("Thursday Evenings 1 (TH1 / 7 Concerts)");
    await expect.soft(syos.base).toBeVisible();

    await syos.bestTicketsClick();

    await expect.soft(syos.ticketQuantityInput).toHaveValue("2");
    await syos.decrementTickets();
    await expect.soft(syos.ticketQuantityInput).toHaveValue("1");
    await syos.bestTicketsClick();

    await syos.continueBtnClick();

    const ticketPrice = await getTextFromElement(syos.seatPriceLineItem);
    const nameLine = await getTextFromElement(syos.seatNameLineItem);

    await expect.soft(syos.basketTotal).toHaveText(`Total: ${ticketPrice}`);
    await expect.soft(syos.seatPriceLineItem).toHaveText(ticketPrice);
    await expect.soft(syos.seatNameLineItem).toContainText(nameLine);
    await syos.confirmSeatsBtnClick();

    await expect(cart.base).toBeVisible({ timeout: 15000 });
    await donation.skipDonation();

    await expect
      .soft(cart.itemSeatInfo)
      .toContainText(convertStringToHaveDashAndSpace(nameLine));
    await expect
      .soft(cart.price)
      .toContainText(convertNumberToCurrencyString(ticketPrice));
    await expect.soft(cart.quantity).toContainText("1");
  });
});

const { getTextFromElement } = require("./helper/uiHelper");

exports.SelectSeatsPage = class SelectYourOwnSeatPage {
  constructor(page) {
    this.page = page;
    this.base = this.page.locator("#syos-root");
    this.performanceDetailsTitle = this.base.locator(
      'h2[class*="syos-performance-details__title"]',
    );

    this.inputGroupNumber = this.base.locator(".input-group");
    this.ticketQuantityInput = this.inputGroupNumber.locator("input");
    this.ticketQuantityDecrementBtn = this.inputGroupNumber.locator('button[class*="decrement"]');
    this.ticketQuantityIncrementBtn = this.inputGroupNumber.locator('button[class*="increment"]');

    this.continueBtn = this.base.locator(".syos-level-selector-container__cta button");

    this.priceTypesEl = this.base.locator(".syos-level-selector-price-types");
    this.allSectorTypes = this.priceTypesEl.locator('[class*="item"][tabindex]');
    this.allNotAvailableSectorTypes = this.priceTypesEl.locator(
      '[class*="item not-available"][tabindex]',
    );
    this.allAvailableSectorTypes = this.priceTypesEl.locator(
      ".syos-level-selector-price-types__item:not(.not-available):not(.bestavailable-order)",
    );
    this.bestAvailableOrdBtn = this.priceTypesEl.locator('[class*="bestavailable-order"]');

    this.zoneAvailableName = this.allAvailableSectorTypes.locator(".zone");

    this.backBtn = this.base.locator('button[class="syos-button syos-button--back"]');

    this.basketBase = this.base.locator(".syos-basket");
    this.basketTotal = this.basketBase.locator(".syos-basket__total");
    this.seatNameLineItem = this.basketBase.locator(".syos-lineitem__title");
    this.seatPriceLineItem = this.basketBase.locator(".syos-lineitem__price .syos-price__value");
    this.basketConfirmBtn = this.basketBase.locator(".syos-basket__actions");
  }

  async backBtnClick() {
    await this.backBtn.click();
  }

  async continueBtnClick() {
    await this.continueBtn.click();
  }

  async confirmSeatsBtnClick() {
    await this.basketConfirmBtn.click();
  }

  async decrementTickets() {
    await this.ticketQuantityDecrementBtn.click();
  }

  async incrementTickets(numberOfClicks = 1) {
    for (let i = 0; i < numberOfClicks; i++) {
      await this.ticketQuantityIncrementBtn.click();
    }
  }

  async bestTicketsClick() {
    await this.bestAvailableOrdBtn.click();
  }

  async getAllAvailableSectorTypesCount() {
    const getAllSectorTypes = await this.allSectorTypes.count();
    const getNotAvailableSectorTypes = await this.allNotAvailableSectorTypes.count();
    return getAllSectorTypes - getNotAvailableSectorTypes;
  }

  async getNamesOfAvailableSectorNames() {
    const availableZonesCount = await this.zoneAvailableName.count();
    const availableZoneNames = [];
    for (let i = 0; i < availableZonesCount; i++) {
      availableZoneNames.push(await getTextFromElement(this.zoneAvailableName.nth(i)));
    }
    return availableZoneNames;
  }

  async clickAtDesiredArea(index) {
    await this.allAvailableSectorTypes.nth(index).waitFor({ state: "visible" });
    await this.allAvailableSectorTypes.nth(index).click();
  }
};

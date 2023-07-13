exports.Cart = class CartPage {
  constructor(page) {
    this.page = page;
    this.base = this.page.locator('#container');
    this.basketMain = this.base.locator('#basket-main');
    this.itemSeatInfo = this.basketMain.locator('.performance:first-of-type');
    this.quantity = this.basketMain.locator('td.quantity');
    this.price = this.basketMain.locator('td.price');
  }
}

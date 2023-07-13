exports.SYOSModalComponent = class SYOSModalComponent {
  constructor(page) {
    this.page = page;
    this.base = this.page.locator('.syos-modal-container');
    this.backdrop = this.base.locator('.syos-modal-backdrop');
    this.closeBtn = this.base.locator('.syos-modal__close');
    this.title = this.base.locator('.syos-enhanced-notice__title');
    this.message = this.base.locator('.syos-enhanced-notice__message p');
    this.confirmBtn = this.base.locator('.syos-enhanced-notice__actions [class="syos-button"]');
  }

  async closeModalComponent() {
    await this.closeBtn.click();
  }

  async confirmModalComponent() {
    await this.confirmBtn.click();
    await this.confirmBtn.waitFor({state:"hidden"});
  }
}

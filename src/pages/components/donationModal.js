exports.DonationModalComponent = class DonationModalComponent {
  constructor(page) {
    this.page = page;
    this.base = this.page.locator("#targetDonationHolder");
    this.skipBtn = this.base.locator("#targetDonationSkip");
  }

  async skipDonation() {
    await this.skipBtn.click();
  }
};

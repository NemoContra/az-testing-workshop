import { type BaseHarnessFilters, ContentContainerComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

export interface NxSelectableCardFilters extends BaseHarnessFilters {
  headline?: string | RegExp;
}

export class NxSelectableCardHarness extends ContentContainerComponentHarness {
  static hostSelector = 'nx-selectable-card';

  private _getInput = this.locatorFor('input');

  private _getFirstLevelHeadline = this.locatorFor('h1, h2, h3');

  static with(options: NxSelectableCardFilters = {}) {
    return new HarnessPredicate(NxSelectableCardHarness, options).addOption('text', options.headline, (harness, text) =>
      HarnessPredicate.stringMatches(harness.getHeadline(), text),
    );
  }

  async getHeadline(): Promise<string> {
    const headline = await this._getFirstLevelHeadline();
    return headline.text();
  }

  async getText(): Promise<string> {
    return (await this.host()).text();
  }

  async click(): Promise<void> {
    const input = await this._getInput();
    return input.click();
  }

  async isChecked(): Promise<boolean> {
    const host = await this.host();
    const value = await host.getAttribute('aria-checked');
    return JSON.parse(value ? value : 'false');
  }
}

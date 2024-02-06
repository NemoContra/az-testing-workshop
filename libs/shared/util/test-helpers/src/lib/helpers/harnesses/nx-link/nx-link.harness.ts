import { type BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

export interface NxLinkFilters extends BaseHarnessFilters {
  text?: string | RegExp;
}

export class NxLinkHarness extends ComponentHarness {
  static hostSelector = 'nx-link';

  private _getAnchor = this.locatorFor('a');

  static with(options: NxLinkFilters = {}) {
    return new HarnessPredicate(NxLinkHarness, options).addOption('text', options.text, (harness, text) =>
      HarnessPredicate.stringMatches(harness.getText(), text),
    );
  }

  async getText(): Promise<string> {
    return (await this.host()).text();
  }

  async click(): Promise<void> {
    const anchor = await this._getAnchor();
    return anchor.click();
  }
}

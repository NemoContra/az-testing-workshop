import {
  type BaseHarnessFilters,
  ComponentHarness,
  HarnessPredicate,
} from '@angular/cdk/testing';

export interface NxCheckboxFilters extends BaseHarnessFilters {
  text?: string | RegExp;
}

export class NxCheckboxHarness extends ComponentHarness {
  static hostSelector = 'nx-checkbox';

  private _getInput = this.locatorFor('input');

  static with(options: NxCheckboxFilters = {}) {
    return new HarnessPredicate(NxCheckboxHarness, options).addOption(
      'text',
      options.text,
      (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text)
    );
  }

  async getText(): Promise<string> {
    return (await this.host()).text();
  }

  async click(): Promise<void> {
    const input = await this._getInput();
    return input.click();
  }

  async isChecked(): Promise<boolean> {
    const input = await this._getInput();
    const value = await input.getAttribute('value');
    return JSON.parse(value ? value : 'false');
  }
}

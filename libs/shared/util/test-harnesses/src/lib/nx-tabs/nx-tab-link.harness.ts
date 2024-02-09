import {
  ComponentHarness,
  type ComponentHarnessConstructor,
  HarnessPredicate,
} from '@angular/cdk/testing';

import { type NxTabLinkHarnessFilters } from './nx-tab-harness-filters';

export class NxTabLinkHarness extends ComponentHarness {
  static hostSelector = '.nx-tab-link';

  static with<T extends NxTabLinkHarness>(
    this: ComponentHarnessConstructor<T>,
    options: NxTabLinkHarnessFilters = {}
  ): HarnessPredicate<T> {
    return new HarnessPredicate(this, options).addOption(
      'label',
      options.label,
      (harness, label) =>
        HarnessPredicate.stringMatches(harness.getLabel(), label)
    );
  }

  async getLabel(): Promise<string> {
    return (await this.host()).text();
  }

  async isActive(): Promise<boolean> {
    const host = await this.host();
    return host.hasClass('is-active');
  }

  async isDisabled(): Promise<boolean> {
    const host = await this.host();
    return host.hasClass('is-disabled');
  }

  async click(): Promise<void> {
    await (await this.host()).click();
  }
}

import { ComponentHarness, type ComponentHarnessConstructor, HarnessPredicate, parallel } from '@angular/cdk/testing';

import { type NxTabLinkHarnessFilters, type NxTabNavBarHarnessFilters } from './nx-tab-harness-filters';
import { NxTabLinkHarness } from './nx-tab-link.harness';

export class NxTabNavBarHarness extends ComponentHarness {
  static hostSelector = 'nx-tab-nav-bar';

  static with<T extends NxTabNavBarHarness>(
    this: ComponentHarnessConstructor<T>,
    options: NxTabNavBarHarnessFilters = {},
  ): HarnessPredicate<T> {
    return new HarnessPredicate(this, options);
  }

  async getLinks(filter: NxTabLinkHarnessFilters = {}): Promise<NxTabLinkHarness[]> {
    return this.locatorForAll(NxTabLinkHarness.with(filter))();
  }

  async getActiveLink(): Promise<NxTabLinkHarness> {
    const links = await this.getLinks();
    const isActive = await parallel(() => links.map((t) => t.isActive()));
    for (let i = 0; i < links.length; i++) {
      if (isActive[i]) {
        return links[i];
      }
    }
    throw new Error('No active link could be found.');
  }

  async clickLink(filter: NxTabLinkHarnessFilters = {}): Promise<void> {
    const tabs = await this.getLinks(filter);
    if (!tabs.length) {
      throw Error(`Cannot find nx-tab-link matching filter ${JSON.stringify(filter)}`);
    }
    await tabs[0].click();
  }
}

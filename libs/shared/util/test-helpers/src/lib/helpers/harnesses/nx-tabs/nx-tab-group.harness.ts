import { ComponentHarness, type ComponentHarnessConstructor, HarnessPredicate, parallel } from '@angular/cdk/testing';

import { type NxTabGroupHarnessFilters, type NxTabHarnessFilters } from './nx-tab-harness-filters';
import { NxTabHarness } from './nx-tab.harness';

export class NxTabGroupHarness extends ComponentHarness {
  static hostSelector = 'nx-tab-group';

  static with<T extends NxTabGroupHarness>(
    this: ComponentHarnessConstructor<T>,
    options: NxTabGroupHarnessFilters = {},
  ): HarnessPredicate<T> {
    return new HarnessPredicate(this, options).addOption(
      'selectedTabLabel',
      options.selectedTabLabel,
      async (harness, label) => {
        const selectedTab = await harness.getSelectedTab();
        return HarnessPredicate.stringMatches(await selectedTab.getLabel(), label);
      },
    );
  }

  async getTabs(filter: NxTabHarnessFilters = {}): Promise<NxTabHarness[]> {
    return this.locatorForAll(NxTabHarness.with(filter))();
  }

  async getSelectedTab(): Promise<NxTabHarness> {
    const tabs = await this.getTabs();
    const isSelected = await parallel(() => tabs.map((t) => t.isSelected()));
    for (let i = 0; i < tabs.length; i++) {
      if (isSelected[i]) {
        return tabs[i];
      }
    }
    throw new Error('No selected tab could be found.');
  }

  async selectTab(filter: NxTabHarnessFilters = {}): Promise<void> {
    const tabs = await this.getTabs(filter);
    if (!tabs.length) {
      throw Error(`Cannot find nx-tab matching filter ${JSON.stringify(filter)}`);
    }
    await tabs[0].select();
  }
}

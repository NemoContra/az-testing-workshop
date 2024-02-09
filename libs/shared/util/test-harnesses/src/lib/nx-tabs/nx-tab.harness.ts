import {
  type ComponentHarnessConstructor,
  ContentContainerComponentHarness,
  type HarnessLoader,
  HarnessPredicate,
} from '@angular/cdk/testing';

import { type NxTabHarnessFilters } from './nx-tab-harness-filters';

export class NxTabHarness extends ContentContainerComponentHarness<string> {
  static hostSelector = '.nx-tab-header__item';

  static with<T extends NxTabHarness>(
    this: ComponentHarnessConstructor<T>,
    options: NxTabHarnessFilters = {}
  ): HarnessPredicate<T> {
    return new HarnessPredicate(this, options)
      .addOption('label', options.label, (harness, label) =>
        HarnessPredicate.stringMatches(harness.getLabel(), label)
      )
      .addOption(
        'selected',
        options.selected,
        async (harness, selected) => (await harness.isSelected()) === selected
      );
  }

  async getLabel(): Promise<string> {
    return (await this.host()).text();
  }

  async isSelected(): Promise<boolean> {
    const hostEl = await this.host();
    return (await hostEl.getAttribute('aria-selected')) === 'true';
  }

  async isDisabled(): Promise<boolean> {
    const hostEl = await this.host();
    return hostEl.hasClass('nx-tab-header__item--disabled');
  }

  async select(): Promise<void> {
    await (await this.host()).click('center');
  }

  async getTextContent(): Promise<string> {
    const contentId = await this._getContentId();
    const contentEl = await this.documentRootLocatorFactory().locatorFor(
      `#${contentId}`
    )();
    return contentEl.text();
  }

  protected override async getRootHarnessLoader(): Promise<HarnessLoader> {
    const contentId = await this._getContentId();
    return this.documentRootLocatorFactory().harnessLoaderFor(`#${contentId}`);
  }

  private async _getContentId(): Promise<string> {
    const hostEl = await this.host();
    // Tabs never have an empty "aria-controls" attribute.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (await hostEl.getAttribute('aria-controls'))!;
  }
}

import { type BaseHarnessFilters, ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

import { NxFormFieldControlHarness } from '../nx-form-field/control';

export interface NxDropdownItemFilters extends BaseHarnessFilters {
  text?: string | RegExp;
}

export class NxDropdownItemHarness extends ComponentHarness {
  static hostSelector = 'nx-dropdown-item';

  static with(options: NxDropdownItemFilters = {}) {
    return new HarnessPredicate(NxDropdownItemHarness, options).addOption('text', options.text, (harness, text) =>
      HarnessPredicate.stringMatches(harness.getText(), text),
    );
  }

  async click(): Promise<void> {
    return (await this.host()).click();
  }

  async getText(): Promise<string> {
    return (await this.host()).text();
  }
}

export interface NxDropdownFilters extends BaseHarnessFilters {
  /** Text is either the placeholder, or the currently selected value **/
  text?: string | RegExp;
  readonly?: boolean;
  disabled?: boolean;
}

export class NxDropdownHarness extends NxFormFieldControlHarness {
  static hostSelector = 'nx-dropdown';

  static with(options: NxDropdownFilters = {}) {
    return new HarnessPredicate(NxDropdownHarness, options)
      .addOption('text', options.text, (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text))

      .addOption('readonly', options.readonly, async (harness, readonly) => (await harness.isReadonly()) === readonly)
      .addOption('disabled', options.disabled, async (harness, disabled) => (await harness.isDisabled()) === disabled);
  }

  private documentRootLocator = this.documentRootLocatorFactory();
  private backdrop = this.documentRootLocator.locatorFor('.cdk-overlay-backdrop');

  async click(): Promise<void> {
    return (await this.host()).click();
  }

  async isOpen(): Promise<boolean> {
    return !!(await this.documentRootLocator.locatorForOptional(`.nx-dropdown__panel-body`)());
  }

  async open(): Promise<void> {
    if (!(await this.isOpen())) {
      return await this.click();
    }
  }

  async close(): Promise<void> {
    if (await this.isOpen()) {
      return (await this.backdrop()).click();
    }
  }

  async getItems(filter?: Omit<NxDropdownItemFilters, 'ancestor'>): Promise<NxDropdownItemHarness[]> {
    await this.open();
    const options = await this.documentRootLocator.locatorForAll(NxDropdownItemHarness.with(filter))();
    await this.close();
    return options;
  }

  async clickItem(filter?: NxDropdownItemFilters): Promise<void> {
    await this.open();

    const options = await this.getItems(filter);

    if (options.length === 0) {
      const presentOptionsWithoutFilter = await this.getItems();
      const availableOptions = await Promise.all(presentOptionsWithoutFilter.map((o) => o.getText()));
      throw Error(
        `Select does not have options matching the specified filter: ${filter?.text}, available are ${availableOptions}.`,
      );
    }
    await options[0].click();
  }

  async getText(): Promise<string> {
    return (await this.host()).text();
  }

  async isDisabled(): Promise<boolean> {
    const host = await this.host();
    const disabled = await host.getAttribute('disabled');
    return !!disabled;
  }

  async isReadonly(): Promise<boolean> {
    const host = await this.host();
    const readonly = await host.getAttribute('readonly');
    return !!readonly;
  }
}

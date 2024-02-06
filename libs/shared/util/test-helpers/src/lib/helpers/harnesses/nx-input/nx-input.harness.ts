import { type BaseHarnessFilters, HarnessPredicate, parallel } from '@angular/cdk/testing';

import { NxFormFieldControlHarness } from '../nx-form-field/control';

export interface NxInputHarnessFilters extends BaseHarnessFilters {
  value?: string | RegExp;
  name?: string | RegExp;
  placeholder?: string | RegExp;
}

export class NxInputHarness extends NxFormFieldControlHarness {
  static hostSelector = '[nxInput]';

  static with(options: NxInputHarnessFilters = {}): HarnessPredicate<NxInputHarness> {
    return new HarnessPredicate(NxInputHarness, options)
      .addOption('value', options.value, (harness, value) => {
        return HarnessPredicate.stringMatches(harness.getValue(), value);
      })
      .addOption('placeholder', options.placeholder, (harness, placeholder) => {
        return HarnessPredicate.stringMatches(harness.getPlaceholder(), placeholder);
      })
      .addOption('name', options.name, async (harness, name) => {
        return HarnessPredicate.stringMatches((await harness.host()).getProperty('name'), name);
      });
  }

  async getValue<T = string>(): Promise<T> {
    // The "value" property of the native input is never undefined.
    return (await this.host()).getProperty<T>('value');
  }

  async getPlaceholder(): Promise<string> {
    const host = await this.host();
    const [placeholder, dataPlaceholder] = await parallel(() => [
      host.getProperty<string>('placeholder'),
      host.getAttribute('data-placeholder'),
    ]);
    return placeholder || dataPlaceholder || '';
  }

  async isValid() {
    return await (await this.host()).hasClass('ng-valid');
  }

  async isInvalid() {
    return await (await this.host()).hasClass('ng-invalid');
  }

  async writeValue<T extends string>(value: T) {
    const hostElement = await this.host();
    await hostElement.clear();
    if (value) {
      await hostElement.sendKeys(value);
    }
    return hostElement.blur();
  }
}

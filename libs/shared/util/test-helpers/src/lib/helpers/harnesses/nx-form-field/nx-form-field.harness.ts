import {
  type BaseHarnessFilters,
  type ComponentHarnessConstructor,
  ContentContainerComponentHarness,
  HarnessPredicate,
  type HarnessQuery,
  parallel,
  type TestElement,
} from '@angular/cdk/testing';

import { NxDropdownHarness } from '../nx-dropdown';
import { NxInputHarness } from '../nx-input';

import { type NxFormFieldControlHarness } from './control';
import { isNullOrUndefined } from '../../defined-null-checks';

export interface NxFormFieldFilters extends BaseHarnessFilters {
  label?: string | RegExp;
  hasErrors?: boolean;
}

type FormFieldControlHarness = NxInputHarness | NxDropdownHarness;

export class NxFormFieldHarness extends ContentContainerComponentHarness {
  static hostSelector = 'nx-formfield';

  static with(options: NxFormFieldFilters = {}): HarnessPredicate<NxFormFieldHarness> {
    return new HarnessPredicate<NxFormFieldHarness>(NxFormFieldHarness, options)
      .addOption('label', options.label, (harness, label) => HarnessPredicate.stringMatches(harness.getLabel(), label))
      .addOption(
        'hasErrors',
        options.hasErrors,
        async (harness, hasErrors) => (await harness.hasErrors()) === hasErrors,
      );
  }

  private _prefix = this.locatorForOptional('[nxFormfieldPrefix]');
  private _suffix = this.locatorForOptional('[nxFormfieldSuffix]');
  private _appendix = this.locatorForOptional('[nxFormfieldAppendix]');
  private _inputControl = this.locatorForOptional(NxInputHarness);
  private _dropdownControl = this.locatorForOptional(NxDropdownHarness);

  async getControl<T extends NxFormFieldControlHarness>(type: HarnessQuery<T>): Promise<T>;
  async getControl<T extends NxFormFieldControlHarness>(type: ComponentHarnessConstructor<T>): Promise<T>;
  async getControl(): Promise<FormFieldControlHarness>;
  async getControl<T extends NxFormFieldControlHarness>(type?: HarnessQuery<T>) {
    if (type) {
      return this.locatorFor(type)();
    }
    const [input, dropdown] = await parallel(() => [this._inputControl(), this._dropdownControl()]);

    // FormFields always require a control descendant to exist
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (input ?? dropdown)!;
  }

  async getLabel(): Promise<string> {
    const label = await this.locatorFor('label.nx-formfield__label')();
    return label.text();
  }

  async getPrefix(): Promise<TestElement | null> {
    return this._prefix();
  }

  async getSuffix(): Promise<TestElement | null> {
    return this._suffix();
  }

  async getAppendix(): Promise<TestElement | null> {
    return this._appendix();
  }

  async getHints(): Promise<string[]> {
    const formFieldHints = await this.locatorForAll('.nx-formfield-hint')();
    return Promise.all(formFieldHints.map((hint) => hint.text()));
  }

  async getErrors(): Promise<string[]> {
    const formFieldErrors = await this.locatorForAll('nx-error')();
    const errorsAreVisible = (
      await Promise.all(formFieldErrors.map((error) => error.getAttribute('hidden').then(isNullOrUndefined)))
    ).reduce((p, c) => p && c, true);
    if (!errorsAreVisible) {
      throw new Error('There are hidden errors which will not be visible.');
    }
    return Promise.all(formFieldErrors.map((hint) => hint.text()));
  }

  async hasErrors(): Promise<boolean> {
    const errors = await this.getErrors();
    return errors.length > 0;
  }

  async isValid(): Promise<boolean> {
    const host = await this.host();
    return host.hasClass('has-error').then((result) => !result);
  }
}

import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  type BaseHarnessFilters,
  ComponentHarness,
  HarnessPredicate,
} from '@angular/cdk/testing';

export interface NxMultiStepItemFilters extends BaseHarnessFilters {
  label?: string | RegExp;
  completed?: boolean;
  selected?: boolean;
}

export class NxMultiStepItemHarness extends ComponentHarness {
  static hostSelector = 'nx-multi-step-item';

  static with(options: NxMultiStepItemFilters = {}) {
    return new HarnessPredicate(NxMultiStepItemHarness, options)
      .addOption('label', options.label, (harness, label) =>
        HarnessPredicate.stringMatches(harness.getLabel(), label)
      )
      .addOption(
        'completed',
        options.completed,
        async (harness, completed) =>
          (await harness.isCompleted()) === completed
      )
      .addOption(
        'selected',
        options.selected,
        async (harness, selected) => (await harness.isSelected()) === selected
      );
  }

  async click() {
    const host = await this.host();
    await host.click();
  }

  async getLabel(): Promise<string> {
    const host = await this.host();
    const ariaLabel = await host.getAttribute('aria-label');
    return ariaLabel?.trim() ?? '';
  }

  async isCompleted() {
    return (await this.host()).hasClass('is-completed');
  }

  async isSelected() {
    return coerceBooleanProperty(
      await (await this.host()).getAttribute('aria-selected')
    );
  }
}

export class NxMultiStepperHarness extends ComponentHarness {
  static hostSelector = 'nx-multi-stepper';

  private static tabPanelSelector = 'div[role="tabpanel"]';

  private _currentStep = this.locatorFor(
    NxMultiStepItemHarness.with({ selected: true })
  );
  private _currentPanel = this.locatorFor(
    `${NxMultiStepperHarness.tabPanelSelector}[aria-expanded="true"]`
  );

  async getSteps(filters?: NxMultiStepItemFilters) {
    return this.locatorForAll(NxMultiStepItemHarness.with(filters))();
  }

  async findStep(filters: NxMultiStepItemFilters) {
    return this.locatorFor(NxMultiStepItemHarness.with(filters))();
  }

  async getCurrentStep() {
    return this._currentStep();
  }

  async getCurrentPanel() {
    return this._currentPanel();
  }
}

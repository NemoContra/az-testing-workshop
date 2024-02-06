import { ComponentHarness } from '@angular/cdk/testing';

import { NxRadioHarness, type NxRadioHarnessFilters } from './nx-radio.harness';

export class NxRadioGroupHarness extends ComponentHarness {
  static hostSelector = 'nx-radio-group';

  async getRadioButtons(filter?: NxRadioHarnessFilters): Promise<NxRadioHarness[]> {
    return this.locatorForAll(NxRadioHarness.with(filter))();
  }
}

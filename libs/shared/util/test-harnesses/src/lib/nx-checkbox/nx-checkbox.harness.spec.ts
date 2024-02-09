import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import {
  NxCheckboxComponent,
  NxCheckboxModule,
} from '@aposin/ng-aquila/checkbox';
import { createHostFactory } from '@ngneat/spectator/jest';

import { NxCheckboxHarness } from './nx-checkbox.harness';

describe('NxCheckboxHarness', () => {
  const createComponent = createHostFactory({
    component: NxCheckboxComponent,
    imports: [NxCheckboxModule],
  });

  const setup = async (template: string) => {
    const spectator = createComponent(template);
    const loader = TestbedHarnessEnvironment.loader(spectator.fixture);
    const checkbox = await loader.getHarness(NxCheckboxHarness);
    return { spectator, loader, checkbox };
  };

  describe('getText', () => {
    it('should return the inner text', async () => {
      const innerText = 'Test123';
      const { checkbox } = await setup(
        `<nx-checkbox>${innerText}</nx-checkbox>`
      );
      await expect(checkbox.getText()).resolves.toEqual(innerText);
    });
  });

  describe('click', () => {
    it('should set the value to true', async () => {
      const { checkbox } = await setup(`<nx-checkbox>123</nx-checkbox>`);
      await checkbox.click();
      await expect(checkbox.isChecked()).resolves.toBeTruthy();
    });

    it('should be able to deactivate the value', async () => {
      const { checkbox } = await setup(`<nx-checkbox>123</nx-checkbox>`);
      await checkbox.click();
      await checkbox.click();
      await expect(checkbox.isChecked()).resolves.toBeFalsy();
    });
  });
});

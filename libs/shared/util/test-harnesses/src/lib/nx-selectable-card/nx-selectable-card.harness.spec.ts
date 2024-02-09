import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import {
  NxCardModule,
  NxSelectableCardComponent,
} from '@aposin/ng-aquila/card';
import { createHostFactory } from '@ngneat/spectator/jest';

import {
  type NxSelectableCardFilters,
  NxSelectableCardHarness,
} from './nx-selectable-card.harness';

describe('NxSelectableCardHarness', () => {
  const createComponent = createHostFactory({
    component: NxSelectableCardComponent,
    imports: [NxCardModule],
  });

  const setup = async (
    template: string,
    filters: NxSelectableCardFilters = {}
  ) => {
    const spectator = createComponent(template);
    const loader = TestbedHarnessEnvironment.loader(spectator.fixture);
    const selectableCard = await loader.getHarness(
      NxSelectableCardHarness.with(filters)
    );
    return { spectator, loader, selectableCard };
  };

  describe('getText', () => {
    it('should return the inner text', async () => {
      const innerText = 'Test123';
      const { selectableCard } = await setup(
        `<nx-selectable-card>${innerText}</nx-selectable-card>`
      );
      await expect(selectableCard.getText()).resolves.toEqual(innerText);
    });

    it('should return the headline', async () => {
      const innerText = 'Test123';
      const { selectableCard } = await setup(
        `<nx-selectable-card><h3>${innerText}</h3></nx-selectable-card>`
      );
      await expect(selectableCard.getHeadline()).resolves.toEqual(innerText);
    });

    it('should be able to find by title', async () => {
      const innerText = 'Test123';
      const { selectableCard } = await setup(
        `<nx-selectable-card><h3>${innerText}</h3></nx-selectable-card>`,
        {
          headline: innerText,
        }
      );
      await expect(selectableCard.getHeadline()).resolves.toEqual(innerText);
    });
  });

  describe('click', () => {
    it('should set the value to true', async () => {
      const { selectableCard } = await setup(
        `<nx-selectable-card>123</nx-selectable-card>`
      );
      await selectableCard.click();
      await expect(selectableCard.isChecked()).resolves.toBeTruthy();
    });

    it('should be able to deactivate the value', async () => {
      const { selectableCard } = await setup(
        `<nx-selectable-card>123</nx-selectable-card>`
      );
      await selectableCard.click();
      await selectableCard.click();
      await expect(selectableCard.isChecked()).resolves.toBeFalsy();
    });
  });
});

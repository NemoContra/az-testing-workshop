import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { NxRadioGroupComponent, NxRadioModule } from '@aposin/ng-aquila/radio-button';
import { createHostFactory } from '@ngneat/spectator/jest';

import { NxRadioGroupHarness } from './nx-radio-group.harness';

describe('NxRadioGroupHarness', () => {
  const createComponent = createHostFactory({
    component: NxRadioGroupComponent,
    imports: [NxRadioModule],
  });

  const selectionSpy = jest.fn();

  const setup = async () => {
    const spectator = createComponent(
      `<nx-radio-group (groupValueChange)="onSelection($event.value)">
        <nx-radio value="FIRST">First</nx-radio>
        <nx-radio value="SECOND">Second</nx-radio>
       </nx-radio-group>`,
      { hostProps: { onSelection: selectionSpy } },
    );
    const loader = TestbedHarnessEnvironment.loader(spectator.fixture);
    const radioGroup = await loader.getHarness(NxRadioGroupHarness);
    return { radioGroup };
  };

  describe('getRadioButtons', () => {
    it('should be able to retrieve all options', async () => {
      const { radioGroup } = await setup();
      const radioButtons = await radioGroup.getRadioButtons();
      expect(radioButtons.length).toEqual(2);
    });
  });
});

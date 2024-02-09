import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import {
  NxMultiStepperComponent,
  NxProgressStepperModule,
} from '@aposin/ng-aquila/progress-stepper';
import { createHostFactory } from '@ngneat/spectator/jest';

import { NxMultiStepperHarness } from './nx-multi-stepper.harness';

const createComponent = createHostFactory({
  component: NxMultiStepperComponent,
  imports: [NxProgressStepperModule],
});

const setup = (template: string) => {
  const spectator = createComponent(template);
  const loader = TestbedHarnessEnvironment.loader(spectator.fixture);
  return { spectator, loader };
};

it('should work', async () => {
  const { loader } = setup(`<nx-multi-stepper></nx-multi-stepper>`);

  const stepper = await loader.getHarness(NxMultiStepperHarness);
  expect(stepper).toBeInstanceOf(NxMultiStepperHarness);
});

describe('NxMultiStepperHarness', () => {
  it('should find all steps', async () => {
    const { loader } = setup(`
    <nx-multi-stepper>
      <nx-step>Foo</nx-step>
      <nx-step>Bar</nx-step>
      <nx-step>Home</nx-step>
    </nx-multi-stepper>`);

    const stepper = await loader.getHarness(NxMultiStepperHarness);
    const steps = await stepper.getSteps();
    expect(steps).toHaveLength(3);
  });

  it('should find completed steps', async () => {
    const { loader } = setup(`
    <nx-multi-stepper [selectedIndex]="1">
      <nx-step label="Foo" [completed]="true"></nx-step>
      <nx-step label="Bar"></nx-step>
      <nx-step label="Home" [completed]="true"></nx-step>
    </nx-multi-stepper>`);

    const stepper = await loader.getHarness(NxMultiStepperHarness);
    const completedSteps = await stepper.getSteps({ completed: true });
    const nonCompletedSteps = await stepper.getSteps({ completed: false });
    expect(completedSteps).toHaveLength(2);
    expect(nonCompletedSteps).toHaveLength(1);
  });

  it('should find specific step', async () => {
    const { loader } = setup(`
    <nx-multi-stepper>
      <nx-step label="Foo"></nx-step>
      <nx-step label="Bar">Content of Bar</nx-step>
      <nx-step label="Home"></nx-step>
    </nx-multi-stepper>`);

    const stepper = await loader.getHarness(NxMultiStepperHarness);
    const step = await stepper.findStep({ label: /B/ });

    expect(await step.getLabel()).toBe('Bar');
  });

  it('should find currently selected step', async () => {
    const { loader } = setup(`
    <nx-multi-stepper [selectedIndex]="1">
      <nx-step label="Foo"></nx-step>
      <nx-step label="Bar">Content of Bar</nx-step>
      <nx-step label="Home"></nx-step>
    </nx-multi-stepper>`);

    const stepper = await loader.getHarness(NxMultiStepperHarness);
    const step = await stepper.getCurrentStep();
    const stepPanel = await stepper.getCurrentPanel();

    expect(await step.getLabel()).toBe('Bar');
    expect(await stepPanel.text()).toBe('Content of Bar');
  });
});

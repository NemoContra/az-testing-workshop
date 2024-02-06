import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { type AbstractControl, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NxFormfieldComponent, NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputDirective, NxInputModule } from '@aposin/ng-aquila/input';
import { createHostFactory } from '@ngneat/spectator/jest';

import { NxFormFieldHarness } from '../nx-form-field';

import { NxInputHarness } from './nx-input.harness';

describe('NxInputHarness', () => {
  const createComponent = createHostFactory({
    component: NxInputDirective,
    imports: [NxInputModule],
  });

  const setup = (template: string) => {
    const spectator = createComponent(template);
    const loader = TestbedHarnessEnvironment.loader(spectator.fixture);
    return {
      spectator,
      loader,
    };
  };

  it('should get placeholder', async () => {
    const { loader } = setup(`<input nxInput placeholder="my-placeholder" />`);
    const harness = await loader.getHarness(NxInputHarness);

    expect(await harness.getPlaceholder()).toBe('my-placeholder');
  });

  it('should search by placeholder', async () => {
    const harnesses = await setup(`
    <input nxInput placeholder="age" />
    <input nxInput placeholder="name" />
  `).loader.getAllHarnesses(NxInputHarness.with({ placeholder: 'age' }));

    expect(harnesses[0]).toHaveLength(1);
    expect(await harnesses[0].getPlaceholder()).toBe('age');
  });

  it('should search by value', async () => {
    const harnesses = await setup(`
    <input nxInput value="foo" />
    <input nxInput value="bar" />
  `).loader.getAllHarnesses(NxInputHarness.with({ value: 'bar' }));

    expect(harnesses[0]).toHaveLength(1);
    expect(await harnesses[0].getValue()).toBe('bar');
  });
});

describe('NxFormFieldControlHarness implementation', () => {
  const createComponent = createHostFactory({
    component: NxFormfieldComponent,
    imports: [NxFormfieldModule, ReactiveFormsModule, NxInputModule],
  });

  const setup = (control: AbstractControl = new FormControl()) => {
    const spectator = createComponent('<nx-formfield><input nxInput [formControl]="control"/></nx-formfield>', {
      hostProps: { control },
    });
    const loader = TestbedHarnessEnvironment.loader(spectator.fixture);
    return { spectator, loader };
  };

  it('should be found by NxFormFieldHarness.getControl', async () => {
    const { loader } = setup();
    const formfield = await loader.getHarness(NxFormFieldHarness);
    const input = await formfield.getControl(NxInputHarness);
    expect(input).toBeDefined();
  });

  it('should set and get updated value', async () => {
    const { loader } = setup(new FormControl('this-is-value'));
    const input = await loader.getHarness(NxInputHarness);
    const newValue = 'new-value-by-set';
    await input.writeValue(newValue);
    expect(await input.getValue()).toBe(newValue);
  });

  it('should return state validity', async () => {
    const { loader } = setup(new FormControl(''));
    const input = await loader.getHarness(NxInputHarness);
    expect(await input.isValid()).toBe(true);
  });

  it('should return state invalidity', async () => {
    const { loader } = setup(new FormControl('', Validators.required));
    const input = await loader.getHarness(NxInputHarness);
    expect(await input.isInvalid()).toBe(true);
  });
});

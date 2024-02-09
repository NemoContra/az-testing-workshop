import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  NxFormfieldComponent,
  NxFormfieldModule,
} from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { createHostFactory } from '@ngneat/spectator/jest';

import { NxInputHarness } from '../nx-input/nx-input.harness';

import { NxFormFieldHarness } from './nx-form-field.harness';

const createComponent = createHostFactory({
  component: NxFormfieldComponent,
  imports: [NxFormfieldModule, NxInputModule, ReactiveFormsModule],
});

const setup = (template: string, control = new FormControl<string>('')) => {
  const spectator = createComponent(template, { hostProps: { control } });
  const loader = TestbedHarnessEnvironment.loader(spectator.fixture);
  return { spectator, loader, control };
};

describe('filters', () => {
  it('should filter by label', async () => {
    const { loader } = setup(
      `<nx-formfield label="Foo"><input nxInput /></nx-formfield>
       <nx-formfield label="Bar"><input nxInput /></nx-formfield>
       <nx-formfield label="Bridge"><input nxInput /></nx-formfield>`
    );

    expect(
      await loader.getAllHarnesses(NxFormFieldHarness.with({ label: /B/ }))
    ).toHaveLength(2);
    expect(
      await loader.getAllHarnesses(NxFormFieldHarness.with({ label: 'Foo' }))
    ).toHaveLength(1);
  });

  it('should filter by hasErrors', async () => {
    const { loader } = setup(
      `
      <nx-formfield ><input nxInput [formControl]="control"><nx-error nxFormfieldError>This is Error</nx-error></nx-formfield>
      <nx-formfield><input nxInput nxFormfieldError> <nx-error>This is Error</nx-error></nx-formfield>`,
      new FormControl('', Validators.required)
    );
    expect(
      await loader.getAllHarnesses(NxFormFieldHarness.with({ hasErrors: true }))
    ).toHaveLength(1);
    expect(
      await loader.getAllHarnesses(
        NxFormFieldHarness.with({ hasErrors: false })
      )
    ).toHaveLength(1);
  });
});

it('should not get errors when control is valid', async () => {
  const { loader, control } = setup(
    `<nx-formfield >
        <input nxInput minlength="5" [formControl]="control">
        <nx-error nxFormfieldError>Error 1</nx-error>
        <nx-error nxFormfieldError>Error 2</nx-error>
    </nx-formfield>`,
    new FormControl('')
  );
  control.markAllAsTouched();

  const formfield = await loader.getHarness(NxFormFieldHarness);
  const errors = await formfield.getErrors();
  expect(errors).toHaveLength(0);
});

it('should get errors when control is invalid', async () => {
  const { loader, control } = setup(
    `<nx-formfield >
        <input nxInput minlength="5" [formControl]="control">
        <nx-error nxFormfieldError>Error 1</nx-error>
        <nx-error nxFormfieldError>Error 2</nx-error>
    </nx-formfield>`,
    new FormControl('', Validators.required)
  );
  control.markAllAsTouched();

  const formfield = await loader.getHarness(NxFormFieldHarness);
  const errors = await formfield.getErrors();
  expect(errors).toEqual(['Error 1', 'Error 2']);
});

it('should get invalid status if control has validation error', async () => {
  const { loader, control } = setup(
    `<nx-formfield >
        <input nxInput minlength="5" [formControl]="control">
        <nx-error nxFormfieldError>Error 1</nx-error>
    </nx-formfield>`,
    new FormControl('', Validators.minLength(5))
  );
  control.markAllAsTouched();

  const formfield = await loader.getHarness(NxFormFieldHarness);
  const input = await formfield.getHarness(NxInputHarness);
  await input.writeValue('123');
  const isValid = await formfield.isValid();
  expect(isValid).toBeFalsy();
});

it('should find prefix', async () => {
  const { loader } = setup(
    `<nx-formfield><button nxFormfieldPrefix>Button</button><input nxInput></nx-formfield>`
  );
  const formfield = await loader.getHarness(NxFormFieldHarness);
  const prefix = await formfield.getPrefix();

  expect(await prefix?.matchesSelector('button')).toBe(true);
});

it('should find suffix', async () => {
  const { loader } = setup(
    `<nx-formfield ><input nxInput><button nxFormfieldSuffix>Button</button></nx-formfield>`
  );
  const formfield = await loader.getHarness(NxFormFieldHarness);
  const suffix = await formfield.getSuffix();

  expect(await suffix?.matchesSelector('button')).toBe(true);
});

it('should find appendix', async () => {
  const { loader } = setup(
    `<nx-formfield ><input nxInput><button nxFormfieldAppendix>Button</button></nx-formfield>`
  );
  const formfield = await loader.getHarness(NxFormFieldHarness);
  const appendix = await formfield.getAppendix();

  expect(await appendix?.matchesSelector('button')).toBe(true);
});

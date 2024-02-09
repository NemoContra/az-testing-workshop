it.skip('placeholder', () => {
  /* noop */
});

/**
 * TODO: Consider if this is useful (shrug)
 *
export const runNxFormFieldControlHarnessSharedSpec = (
  module: any,
  controlHarness: ComponentHarnessConstructor<NxFormFieldControlHarness>,
  controlTemplate: string,
) => {
  const createComponent = createHostFactory({
    component: NxFormfieldComponent,
    imports: [NxFormfieldModule, ReactiveFormsModule, module],
  });

  const setup = <Template extends string>(template: Template, control: AbstractControl = new FormControl()) => {
    const spectator = createComponent(template, { hostProps: { control } });
    const loader = TestbedHarnessEnvironment.loader(spectator.fixture);
    return { spectator, loader };
  };

  describe('shared nx-form-field-control-harness tests', () => {
    it('should be found by NxFormFieldHarness.getControl', async () => {
      const { loader } = setup(`<nx-formfield>${controlTemplate}</nx-formfield>`);
      const formfield = await loader.getHarness(NxFormFieldHarness);
      const input = await formfield.getControl(controlHarness);
      expect(input).toBeDefined();
    });

    it('should get value', async () => {
      const { loader } = setup(`<nx-formfield>${controlTemplate}</nx-formfield>`, new FormControl('this-is-value'));
      const input = await loader.getHarness(controlHarness);
      expect(await input.getValue()).toBe('this-is-value');
    });

    it('should set and get value', async () => {
      const { loader } = setup(`<nx-formfield>${controlTemplate}</nx-formfield>`, new FormControl('this-is-value'));
      const input = await loader.getHarness(controlHarness);
      const newValue = 'new-value-by-set';
      await input.setValue(newValue);
      expect(await input.getValue()).toBe(newValue);
    });

    it('should return state validity', async () => {
      const { loader } = setup(`<nx-formfield>${controlTemplate}</nx-formfield>`, new FormControl(''));
      const input = await loader.getHarness(controlHarness);
      expect(await input.isValid()).toBe(true);
    });

    it('should return state invalidity', async () => {
      const { loader } = setup(
        `<nx-formfield>${controlTemplate}</nx-formfield>`,
        new FormControl('', Validators.required),
      );
      const input = await loader.getHarness(controlHarness);
      expect(await input.isInvalid()).toBe(true);
    });
  });
};

 */

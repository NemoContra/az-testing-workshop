import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import {
  NxDropdownComponent,
  NxDropdownModule,
} from '@aposin/ng-aquila/dropdown';
import { createHostFactory } from '@ngneat/spectator/jest';

import { NxDropdownHarness } from './nx-dropdown.harness';

const createComponent = createHostFactory({
  component: NxDropdownComponent,
  imports: [NxDropdownModule],
});

const setup = async (template: string) => {
  const spectator = createComponent(template);
  const loader = TestbedHarnessEnvironment.loader(spectator.fixture);
  const dropdown = await loader.getHarness(NxDropdownHarness);
  return { spectator, loader, dropdown };
};

describe('NxDropdownHarness', () => {
  describe('getOptions', () => {
    const setupGetOptions = () =>
      setup(
        `<nx-dropdown>
      <nx-dropdown-item value="item-1">Foo</nx-dropdown-item>
      <nx-dropdown-item value="item-2">Bar</nx-dropdown-item>
      <nx-dropdown-item value="item-3">Bridge</nx-dropdown-item>
     </nx-dropdown>`
      );

    it('should get all options', async () => {
      const { dropdown } = await setupGetOptions();
      expect(await dropdown.getItems()).toHaveLength(3);
    });

    it('should get options by filter', async () => {
      const { dropdown } = await setupGetOptions();
      expect(await dropdown.getItems({ text: /^B/ })).toHaveLength(2);
      expect(await dropdown.getItems({ text: 'Foo' })).toHaveLength(1);
    });
  });

  describe('opening and closing', () => {
    const setupOpeningAndClosing = () =>
      setup(
        `<nx-dropdown placeholder="This is a Placeholder">
         <nx-dropdown-item value="item-1">Foo</nx-dropdown-item>
       </nx-dropdown>`
      );

    it('should be able to open the dropdown', async () => {
      const { dropdown } = await setupOpeningAndClosing();
      await dropdown.open();
      await expect(dropdown.isOpen()).resolves.toBeTruthy();
    });

    it('shoulb be able to close the dropdown', async () => {
      const { dropdown } = await setupOpeningAndClosing();
      await dropdown.open();
      await dropdown.close();
      await expect(dropdown.isOpen()).resolves.toBeFalsy();
    });
  });

  describe('getText', () => {
    const setupGetText = () =>
      setup(
        `<nx-dropdown placeholder="This is a Placeholder">
         <nx-dropdown-item value="item-1">Foo</nx-dropdown-item>
       </nx-dropdown>`
      );

    it('should get placeholder text when nothing is selected', async () => {
      const { dropdown } = await setupGetText();
      expect(await dropdown.getText()).toBe('This is a Placeholder');
    });

    it('should have text of dropdown item label after click', async () => {
      const { dropdown } = await setupGetText();
      await dropdown.clickItem();
      expect(await dropdown.getText()).toBe('Foo');
    });
  });

  describe('isReadonly', () => {
    it('should return true when dropdown is readonly', async () => {
      const { dropdown } = await setup(`<nx-dropdown readonly></nx-dropdown>`);
      expect(await dropdown.isReadonly()).toBe(true);
    });

    it('should return false when dropdown is not readonly', async () => {
      const { dropdown } = await setup(`<nx-dropdown ></nx-dropdown>`);
      expect(await dropdown.isReadonly()).toBe(false);
    });
  });

  describe('isDisabled', () => {
    it('should return true when dropdown is disabled', async () => {
      const { dropdown } = await setup(`<nx-dropdown disabled></nx-dropdown>`);
      expect(await dropdown.isDisabled()).toBe(true);
    });

    it('should return false when dropdown is not disabled', async () => {
      const { dropdown } = await setup(`<nx-dropdown ></nx-dropdown>`);
      expect(await dropdown.isDisabled()).toBe(false);
    });
  });

  describe('filters', () => {
    const setupFilters = () =>
      setup(`
      <nx-dropdown readonly value="foo"><nx-dropdown-item value="foo">Foo</nx-dropdown-item></nx-dropdown>
      <nx-dropdown disabled placeholder="Bar"></nx-dropdown>
    `);

    it('should find dropdown by current value', async () => {
      const { loader } = await setupFilters();
      const dropdown = await loader.getHarness(
        NxDropdownHarness.with({ text: /Foo/ })
      );
      expect(await dropdown.getText()).toBe('Foo');
    });

    it('should find dropdown by placeholder', async () => {
      const { loader } = await setupFilters();
      const dropdown = await loader.getHarness(
        NxDropdownHarness.with({ text: /Bar/ })
      );
      expect(await dropdown.getText()).toBe('Bar');
    });

    it('should find dropdown by readonly state', async () => {
      const { loader } = await setupFilters();
      const readonlyDropdown = await loader.getHarness(
        NxDropdownHarness.with({ readonly: true })
      );
      const interactiveDropdown = await loader.getHarness(
        NxDropdownHarness.with({ readonly: false })
      );
      expect(await readonlyDropdown.getText()).toBe('Foo');
      expect(await interactiveDropdown.getText()).toBe('Bar');
    });

    it('should find dropdown by disabled state', async () => {
      const { loader } = await setupFilters();
      const disabledDropdown = await loader.getHarness(
        NxDropdownHarness.with({ readonly: true })
      );
      const interactiveDropdown = await loader.getHarness(
        NxDropdownHarness.with({ readonly: false })
      );
      expect(await disabledDropdown.getText()).toBe('Foo');
      expect(await interactiveDropdown.getText()).toBe('Bar');
    });
  });
});

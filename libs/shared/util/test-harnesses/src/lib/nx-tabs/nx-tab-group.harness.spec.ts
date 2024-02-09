import {
  ComponentHarness,
  type HarnessLoader,
  parallel,
} from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NxTabsModule } from '@aposin/ng-aquila/tabs';

import { NxTabGroupHarness } from './nx-tab-group.harness';
import { NxTabHarness } from './nx-tab.harness';

describe('NxTabGroupHarness', () => {
  let fixture: ComponentFixture<TestComponent>;
  let loader: HarnessLoader;
  let tabGroup: NxTabGroupHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NxTabsModule, NoopAnimationsModule, TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
    tabGroup = await loader.getHarness(NxTabGroupHarness);
  });

  it('should load harness for tab-group', async () => {
    const tabGroups = await loader.getAllHarnesses(NxTabGroupHarness);
    expect(tabGroups).toHaveLength(1);
  });

  it('should load harness for tab-group with selected tab label', async () => {
    const tabGroups = await loader.getAllHarnesses(
      NxTabGroupHarness.with({
        selectedTabLabel: 'First',
      })
    );
    expect(tabGroups).toHaveLength(1);
  });

  it('should load harness for tab-group with matching tab label regex', async () => {
    const tabGroups = await loader.getAllHarnesses(
      NxTabGroupHarness.with({
        selectedTabLabel: /f.*st/i,
      })
    );
    expect(tabGroups).toHaveLength(1);
  });

  it('should be able to get tabs of tab-group', async () => {
    const tabs = await tabGroup.getTabs();
    expect(tabs).toHaveLength(3);
  });

  it('should be able to get filtered tabs', async () => {
    const tabs = await tabGroup.getTabs({ label: 'Third' });
    expect(tabs).toHaveLength(1);
    expect(await tabs[0].getLabel()).toBe('Third');
  });

  it('should be able to select tab from tab-group', async () => {
    expect(await (await tabGroup.getSelectedTab()).getLabel()).toBe('First');
    await tabGroup.selectTab({ label: 'Second' });
    expect(await (await tabGroup.getSelectedTab()).getLabel()).toBe('Second');
  });

  it('should throw error when attempting to select invalid tab', async () => {
    await expect(tabGroup.selectTab({ label: 'Fake' })).rejects.toThrowError(
      'Cannot find nx-tab matching filter {"label":"Fake"}'
    );
  });

  it('should be able to get label of tabs', async () => {
    const tabs = await tabGroup.getTabs();
    expect(await tabs[0].getLabel()).toBe('First');
    expect(await tabs[1].getLabel()).toBe('Second');
    expect(await tabs[2].getLabel()).toBe('Third');
  });

  it('should be able to get harness for content element of active tab', async () => {
    const tabs = await tabGroup.getTabs();
    expect(await tabs[0].getTextContent()).toBe('Content 1');
    const tabContentHarness = await tabs[0].getHarness(TestTabContentHarness);
    expect(await (await tabContentHarness.host()).text()).toBe('Content 1');
  });

  it('should be able to get disabled state of tab', async () => {
    const tabs = await tabGroup.getTabs();
    expect(await tabs[0].isDisabled()).toBe(false);
    expect(await tabs[1].isDisabled()).toBe(false);
    expect(await tabs[2].isDisabled()).toBe(false);

    fixture.componentInstance.isDisabled = true;
    fixture.detectChanges();

    expect(await tabs[0].isDisabled()).toBe(false);
    expect(await tabs[1].isDisabled()).toBe(false);
    expect(await tabs[2].isDisabled()).toBe(true);
  });

  it('should be able to select specific tab', async () => {
    const tabs = await tabGroup.getTabs();
    expect(await tabs[0].isSelected()).toBe(true);
    expect(await tabs[1].isSelected()).toBe(false);
    expect(await tabs[2].isSelected()).toBe(false);

    await tabs[1].select();
    expect(await tabs[0].isSelected()).toBe(false);
    expect(await tabs[1].isSelected()).toBe(true);
    expect(await tabs[2].isSelected()).toBe(false);

    // Should not be able to select third tab if disabled.
    fixture.componentInstance.isDisabled = true;
    fixture.detectChanges();

    await tabs[2].select();
    expect(await tabs[0].isSelected()).toBe(false);
    expect(await tabs[1].isSelected()).toBe(true);
    expect(await tabs[2].isSelected()).toBe(false);

    // Should be able to select third tab if not disabled.
    fixture.componentInstance.isDisabled = false;
    fixture.detectChanges();
    await tabs[2].select();
    expect(await tabs[0].isSelected()).toBe(false);
    expect(await tabs[1].isSelected()).toBe(false);
    expect(await tabs[2].isSelected()).toBe(true);
  });

  it('should be able to get tabs by selected state', async () => {
    const selectedTabs = await loader.getAllHarnesses(
      NxTabHarness.with({ selected: true })
    );
    const unselectedTabs = await loader.getAllHarnesses(
      NxTabHarness.with({ selected: false })
    );
    expect(await parallel(() => selectedTabs.map((t) => t.getLabel()))).toEqual(
      ['First']
    );
    expect(
      await parallel(() => unselectedTabs.map((t) => t.getLabel()))
    ).toEqual(['Second', 'Third']);
  });
});

@Component({
  template: `
    <nx-tab-group>
      <nx-tab label="First" aria-label="First tab">
        <span class="test-tab-content">Content 1</span>
      </nx-tab>
      <nx-tab label="Second" aria-label="Second tab">
        <span class="test-tab-content">Content 2</span>
      </nx-tab>
      <nx-tab
        label="Third"
        aria-labelledby="tabLabelId"
        [disabled]="isDisabled"
      >
        <ng-template nxTabLabel>Third</ng-template>
        <span class="test-tab-content">Content 3</span>
      </nx-tab>
    </nx-tab-group>
  `,
  standalone: true,
  imports: [NxTabsModule],
})
class TestComponent {
  isDisabled = false;
}

class TestTabContentHarness extends ComponentHarness {
  static hostSelector = '.test-tab-content';
}

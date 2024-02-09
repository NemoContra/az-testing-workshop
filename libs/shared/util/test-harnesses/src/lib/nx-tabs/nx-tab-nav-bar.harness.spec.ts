import { type HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NxTabsModule } from '@aposin/ng-aquila/tabs';

import { NxTabNavBarHarness } from './nx-tab-nav-bar.harness';
import { DummyRouterDestinationComponent } from '@az-testing-workshop/shared/util/test-helpers';

describe('NxTabNavBarHarness', () => {
  let fixture: ComponentFixture<TestComponent>;
  let loader: HarnessLoader;
  let navBar: NxTabNavBarHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        TestComponent,
        RouterTestingModule.withRoutes([
          {
            path: 'first',
            component: DummyRouterDestinationComponent,
          },
          {
            path: 'second',
            component: DummyRouterDestinationComponent,
          },
          {
            path: 'third',
            component: DummyRouterDestinationComponent,
          },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.loader(fixture);
    navBar = await loader.getHarness(NxTabNavBarHarness);
  });

  it('should load harness for tab nav bar', async () => {
    const navBars = await loader.getAllHarnesses(NxTabNavBarHarness);
    expect(navBars).toHaveLength(1);
  });

  it('should be able to get links of nav bar', async () => {
    const links = await navBar.getLinks();
    expect(links).toHaveLength(3);
  });

  it('should be able to get filtered links', async () => {
    const links = await navBar.getLinks({ label: 'Third' });
    expect(links).toHaveLength(1);
    expect(await links[0].getLabel()).toBe('Third');
  });

  it('should be able to click tab from nav bar', async () => {
    expect(await (await navBar.getActiveLink()).getLabel()).toBe('First');
    await navBar.clickLink({ label: 'Second' });
    expect(await (await navBar.getActiveLink()).getLabel()).toBe('Second');
  });

  it('should throw error when attempting to click invalid link', async () => {
    await expect(navBar.clickLink({ label: 'Fake' })).rejects.toThrowError(
      'Cannot find nx-tab-link matching filter {"label":"Fake"}'
    );
  });

  it('should be able to get label of links', async () => {
    const links = await navBar.getLinks();
    expect(await links[0].getLabel()).toBe('First');
    expect(await links[1].getLabel()).toBe('Second');
    expect(await links[2].getLabel()).toBe('Third');
  });

  it('should be able to get disabled state of link', async () => {
    const links = await navBar.getLinks();
    expect(await links[0].isDisabled()).toBe(false);
    expect(await links[1].isDisabled()).toBe(false);
    expect(await links[2].isDisabled()).toBe(false);

    fixture.componentInstance.isDisabled = true;
    fixture.detectChanges();

    expect(await links[0].isDisabled()).toBe(false);
    expect(await links[1].isDisabled()).toBe(false);
    expect(await links[2].isDisabled()).toBe(true);
  });

  it('should be able to click specific link', async () => {
    const links = await navBar.getLinks();
    expect(await links[0].isActive()).toBe(true);
    expect(await links[1].isActive()).toBe(false);
    expect(await links[2].isActive()).toBe(false);

    await links[1].click();
    expect(await links[0].isActive()).toBe(false);
    expect(await links[1].isActive()).toBe(true);
    expect(await links[2].isActive()).toBe(false);
  });
});

@Component({
  template: `
    <nx-tab-nav-bar>
      <a
        nxTabLink
        routerLink="first"
        (click)="select(0, $event)"
        [active]="activeLink === 0"
        >First</a
      >
      <a
        nxTabLink
        routerLink="second"
        (click)="select(1, $event)"
        [active]="activeLink === 1"
        >Second</a
      >
      <a
        nxTabLink
        routerLink="third"
        (click)="select(2, $event)"
        [active]="activeLink === 2"
        [disabled]="isDisabled"
        >Third</a
      >
    </nx-tab-nav-bar>
    <router-outlet></router-outlet>
  `,
  standalone: true,
  imports: [NxTabsModule, RouterModule],
})
class TestComponent {
  activeLink = 0;
  isDisabled = false;

  select(index: number, event: MouseEvent) {
    this.activeLink = index;
    event.preventDefault();
  }
}

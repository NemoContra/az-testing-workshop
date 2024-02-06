import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { NxLinkComponent, NxLinkModule } from '@aposin/ng-aquila/link';
import { createHostFactory } from '@ngneat/spectator/jest';

import { NxLinkHarness } from './nx-link.harness';

describe('NxLinkHarness', () => {
  const createComponent = createHostFactory({
    component: NxLinkComponent,
    imports: [NxLinkModule],
  });

  const clickSpy = jest.fn();

  const setup = async () => {
    const spectator = createComponent(`<nx-link><a (click)="onClick()">Link Text</a></nx-link>`, {
      hostProps: { onClick: clickSpy },
    });
    const loader = TestbedHarnessEnvironment.loader(spectator.fixture);
    const link = await loader.getHarness(NxLinkHarness);
    return { link };
  };

  it('should be able to click', async () => {
    const { link } = await setup();
    await link.click();
    expect(clickSpy).toHaveBeenCalled();
  });

  it('should be able to receive text', async () => {
    const { link } = await setup();
    await expect(link.getText()).resolves.toEqual('Link Text');
  });
});

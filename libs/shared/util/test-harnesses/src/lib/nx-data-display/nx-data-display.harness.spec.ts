import {
  NxDataDisplayComponent,
  NxDataDisplayModule,
} from '@aposin/ng-aquila/data-display';
import { createHostFactory } from '@ngneat/spectator/jest';

import { mixinHarnessLoader } from '../mixin-harness-loader';

import { NxDataDisplayHarness } from './nx-data-display.harness';

const createComponent = mixinHarnessLoader(
  createHostFactory({
    component: NxDataDisplayComponent,
    imports: [NxDataDisplayModule],
  })
);

it('should get label', async () => {
  const { loader } = createComponent(
    `<nx-data-display label="FooBar">Funky Town</nx-data-display>`
  );
  const display = await loader.getHarness(NxDataDisplayHarness);

  expect(await display.getLabel()).toEqual('FooBar');
});

it('should get value', async () => {
  const { loader } = createComponent(
    `<nx-data-display label="FooBar">Funky Town</nx-data-display>`
  );
  const display = await loader.getHarness(NxDataDisplayHarness);

  expect(await display.getValue()).toEqual('Funky Town');
});

it('should find by label', async () => {
  const { loader } = createComponent(
    `<nx-data-display label="Foo">Funky Town</nx-data-display>
    <nx-data-display label="Bar">Funky Town</nx-data-display>`
  );
  const display = await loader.getHarness(
    NxDataDisplayHarness.with({ label: /Foo/ })
  );

  expect(await display.getLabel()).toEqual('Foo');
});

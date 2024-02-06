import { type HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { type ComponentFixture } from '@angular/core/testing';

export type WithHarnessLoader = { loader: HarnessLoader };
export const mixinHarnessLoader = <
  S extends { fixture: ComponentFixture<unknown> },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Factory extends (...args: any[]) => S,
>(
  factory: Factory,
) => {
  return (...params: Parameters<Factory>): ReturnType<Factory> & WithHarnessLoader => {
    const spectator = factory(...params);
    const loader = TestbedHarnessEnvironment.loader(spectator.fixture);
    Object.defineProperty(spectator, 'loader', { value: loader });
    return spectator as ReturnType<Factory> & WithHarnessLoader;
  };
};

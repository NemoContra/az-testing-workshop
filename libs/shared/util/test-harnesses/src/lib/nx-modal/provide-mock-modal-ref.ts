import { NxModalRef } from '@aposin/ng-aquila/modal';

export const provideMockModalRef = (
  implementation: () => {
    close: (result?: unknown) => {
      /* noop */
    };
  }
) => ({
  provide: NxModalRef,
  useFactory: () => implementation(),
});

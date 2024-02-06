import { type Provider } from '@angular/core';
import { NX_MODAL_DATA } from '@aposin/ng-aquila/modal';

/**
 * Provide a mock for NX_MODAL_DATA
 *
 * @param dataOrFactory Produce the dialog's mocked data
 */
export function provideMockModalData<D>(dataOrFactory: D | (() => D)): Provider[] | Provider {
  if (typeof dataOrFactory === 'function') {
    return {
      provide: NX_MODAL_DATA,
      useFactory: dataOrFactory,
    };
  } else {
    return {
      provide: NX_MODAL_DATA,
      useValue: dataOrFactory,
    };
  }
}

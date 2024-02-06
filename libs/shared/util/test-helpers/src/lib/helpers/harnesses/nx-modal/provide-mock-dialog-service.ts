import { type Provider } from '@angular/core';
import { NxDialogService, type NxModalRef } from '@aposin/ng-aquila/modal';
import { NEVER, type Observable } from 'rxjs';

/**
 * Provide a mock for NxDialogService, and provide ConfirmDialogService as is
 *
 * @param result The dialog's mocked result
 * @param close mock of the close function of the modal ref
 */
export function provideMockDialogService<R>(result: Observable<R> | (() => Observable<R>) = NEVER): Provider {
  return [
    {
      provide: NxDialogService,
      useFactory: () =>
        <Partial<NxDialogService>>{
          open: () => {
            const afterClosed = typeof result === 'function' ? result : () => result;
            return {
              afterClosed,
              close: () => {
                /* to be spied on */
              },
            } as NxModalRef<unknown>;
          },
        },
    },
  ];
}

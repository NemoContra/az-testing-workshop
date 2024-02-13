import { Component } from '@angular/core';

export const mockComponent = (options: Partial<Component>) => {
  @Component({
    standalone: true,
    template: '<ng-content></ng-content>',
    ...options,
  })
  class _Component {}
  return _Component;
};

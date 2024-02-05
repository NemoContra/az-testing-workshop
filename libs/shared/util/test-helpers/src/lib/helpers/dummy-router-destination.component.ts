import { Component } from '@angular/core';

/**
 * @ngModule RouterTestHelpersModule
 * @whatItDoes Can be used as a routing target in Karma tests.
 *
 * @description
 *
 * ### Example
 *
 * TestBed.configureTestingModule({
 *   imports: [
 *     RouterTestingModule.withRoutes([
 *       {path: 'dummy', component: DummyRouterDestinationComponent}
 *     ])
 *   ]
 * })
 */
@Component({
  template: ' ',
  selector: 'fonl2-dummy-router-destination-component',
  standalone: true,
})
export class DummyRouterDestinationComponent {}

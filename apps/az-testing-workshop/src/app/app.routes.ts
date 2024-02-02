import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./routes/contraxt-overview/contract-overview.component'),
  },
  {
    path: 'contract-details/:id',
    loadComponent: () =>
      import('./routes/contract-details/contract-details.component'),
  },
  {
    path: 'contract-transaction/:id',
    loadComponent: () =>
      import('./routes/contract-transaction/contract-transaction.component'),
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '',
  },
];

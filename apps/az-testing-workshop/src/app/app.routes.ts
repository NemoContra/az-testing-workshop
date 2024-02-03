import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('./routes/contraxt-overview/contract-overview.component'),
  },
  {
    path: 'details/:id',
    loadComponent: () =>
      import('./routes/contract-details/contract-details.component'),
  },
  {
    path: 'transaktion/:id',
    loadComponent: () =>
      import('./routes/contract-transaction/contract-transaction.component'),
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: '',
  },
];

import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'scan',
        loadComponent: () =>
          import('../scan/scan.page').then((m) => m.scanPage),
      },
      {
        path: 'voucher',
        loadComponent: () =>
          import('../voucher/voucher.page').then((m) => m.VoucherPage),
      },
      {
        path: 'home',
        loadComponent: () =>
          import('../home/home.page').then((m) => m.HomePage),
      },
      {
        path: '',
        redirectTo: '/tabs/scan',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/scan',
    pathMatch: 'full',
  },
];

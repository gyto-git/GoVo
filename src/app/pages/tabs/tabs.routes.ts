import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('../dashboard/dashboard.page').then((m) => m.DashboardPage),
      },
      {
        path: 'scanner',
        loadComponent: () => import('../scanner/scanner.page').then((m) => m.ScannerPage),
      },
      {
        path: 'voucher',
        loadComponent: () => import('../voucher/voucher.page').then((m) => m.VoucherPage),
      },
      {
        path: '',
        redirectTo: '/tabs/dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/dashboard',
    pathMatch: 'full',
  },
];

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.page').then((m) => m.DashboardPage),
  },
  {
    path: 'scanner',
    loadComponent: () => import('./pages/scanner/scanner.page').then((m) => m.ScannerPage),
  },
  {
    path: 'detail-scan',
    loadComponent: () => import('./pages/scanner/detail/detail.page').then((m) => m.DetailPage),
  },
  //auth
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/auth/register/register.page').then((m) => m.RegisterPage),
  },
  // voucher component
  {
    path: 'add',
    loadComponent: () => import('./pages/voucher/add/add.page').then((m) => m.AddPage),
  },
  {
    path: 'edit',
    loadComponent: () => import('./pages/voucher/edit/edit.page').then((m) => m.EditPage),
  },
  {
    path: 'detail',
    loadComponent: () => import('./pages/voucher/detail/detail.page').then((m) => m.DetailPage),
  },
];

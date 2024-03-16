import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'add-voucher',
    loadComponent: () =>
      import('./add-voucher/add-voucher.page').then((m) => m.AddVoucherPage),
  },
  {
    path: 'detail-voucher',
    loadComponent: () =>
      import('./detail-voucher/detail-voucher.page').then(
        (m) => m.DetailVoucherPage
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'qr-example',
    loadComponent: () =>
      import('./qr-example/qr-example.page').then((m) => m.QrExamplePage),
  },
  {
    path: 'qr-generator',
    loadComponent: () =>
      import('./qr-generator/qr-generator.page').then((m) => m.QrGeneratorPage),
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'update',
    loadComponent: () =>
      import('./update/update.page').then((m) => m.UpdatePage),
  },
];

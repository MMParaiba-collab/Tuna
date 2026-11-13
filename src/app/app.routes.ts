import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'splash',
    loadComponent: () => import('./pages/splash/splash.page').then((m) => m.SplashPage),
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'estoque',
    loadComponent: () => import('./pages/estoque/estoque.page').then((m) => m.EstoquePage),
  },
  {
    path: 'preco',
    loadComponent: () => import('./pages/preco/preco.page').then((m) => m.PrecoPage),
  },
  {
    path: 'cliente',
    loadComponent: () => import('./pages/cliente/cliente.page').then((m) => m.ClientePage),
  },
  {
    path: 'sobre',
    loadComponent: () => import('./pages/sobre/sobre.page').then((m) => m.SobrePage),
  },
];

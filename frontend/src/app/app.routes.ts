import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
   {
    path: 'login',
    loadComponent: () =>
      import('./auth/login').then(m => m.Login)
    },
    {
    path: 'register',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./auth/register').then(m => m.Register)
    },
    {
    path: 'shipments',
    canActivate: [AuthGuard],
    loadComponent: () =>
        import('./shipments/shipments').then(m => m.Shipments)
    },
    {
    path: 'shipments/:id',
    canActivate: [AuthGuard],
    loadComponent: () =>
        import('./shipments/shipment-detail').then(m => m.ShipmentDetail)
    },
    {
    path: 'tracking',
    loadComponent: () =>
        import('./tracking').then(m => m.Tracking)
    },
    {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
    }
];
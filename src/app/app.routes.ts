
import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./features/participants/participants.routes').then(m => m.PARTICIPANTS_ROUTES),
  },
  {
    path: 'draw',
    loadChildren: () => import('./features/draw/draw.routes').then(m => m.DRAW_ROUTES),
  },
  {
    path: 'emails',
    loadChildren: () => import('./features/email/email.routes').then(m => m.EMAIL_ROUTES),
  },
  { path: '**', redirectTo: '' },
];

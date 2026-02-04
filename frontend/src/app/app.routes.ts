/**
 * Application routes
 */

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'predict',
    pathMatch: 'full'
  },
  {
    path: 'record',
    loadComponent: () => import('./features/record-entry/record-entry.component')
      .then(m => m.RecordEntryComponent)
  },
  {
    path: 'predict',
    loadComponent: () => import('./features/predict-arrival/predict-arrival.component')
      .then(m => m.PredictArrivalComponent)
  },
  {
    path: 'statistics',
    loadComponent: () => import('./features/statistics/statistics.component')
      .then(m => m.StatisticsComponent)
  },
  {
    path: 'history',
    loadComponent: () => import('./features/history/history.component')
      .then(m => m.HistoryComponent)
  }
];

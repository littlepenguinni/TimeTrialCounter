import { Routes } from '@angular/router';
import {CounterPageComponent} from './counter-page/counter-page.component';
import {HomepageComponent} from './homepage/homepage.component';

export const routes: Routes = [
  { path: 'counter', component: CounterPageComponent },
  { path: '**', component: HomepageComponent },
];

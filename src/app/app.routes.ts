
import { Routes } from '@angular/router';
import { Welcome } from './pages/welcome/welcome';
import { PersonalInformation } from './pages/personal-information/personal-information';

export const routes: Routes = [
  {
    path: '',
    component: Welcome
  },
  {
    path: 'personal-information',
    component: PersonalInformation
    }
];
